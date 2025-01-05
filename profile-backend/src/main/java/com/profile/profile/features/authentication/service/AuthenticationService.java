package com.profile.profile.features.authentication.service;

import com.profile.profile.features.authentication.dto.AuthenticationRequestBody;
import com.profile.profile.features.authentication.dto.AuthenticationResponseBody;
import com.profile.profile.features.authentication.model.AuthenticationUser;
import com.profile.profile.features.authentication.repository.AuthenticationUserRepository;
import com.profile.profile.features.authentication.utils.EmailService;
import com.profile.profile.features.authentication.utils.Encoder;
import com.profile.profile.features.authentication.utils.JsonWebToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class AuthenticationService {
    private final AuthenticationUserRepository authenticationUserRepository;

    private final int durationInMinutes = 1;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;
    private final EmailService emailService;

    @PersistenceContext
    private EntityManager entityManager;


    public AuthenticationService(
            AuthenticationUserRepository authenticationUserRepository,
            Encoder encoder,
            JsonWebToken jsonWebToken,
            EmailService emailService
    ) {
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
        this.jsonWebToken = jsonWebToken;
        this.emailService = emailService;
    }


    public static String generateEmailVerificationToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder(5);

        for(int i = 0; i<=5; i++) {
            token.append(random.nextInt(10));
        }

        return token.toString();
    }


    public void sendEmailVerificationToken(String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);

        if(user.isPresent() && !user.get().getEmailVerified()) {
            String emailVerificationToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);

            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));

            authenticationUserRepository.save(user.get());


            // ---------------------
            // ---------------------
            // ---------------------


            String subject = "Email Verification";
            String body = String.format(
              "Only one step to take full advantage of ProFile.\n\n" +
              "Enter this code to verify your email: " +
              "%s\n\n" +
              "The code will expire in " +
              "%s" +
              " minutes",
              emailVerificationToken, durationInMinutes
            );

            try {
                emailService.sendEmail(email, subject, body);
            }
            catch(Exception e) {
                logger.info("Error while sending email: {}", e.getMessage());
            }
        }

        else {
            throw new IllegalArgumentException("Email verification token failed, or email is already verified.");
        }
    }




    public void validateEmailVerificationToken(String token, String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);

        if(
                user.isPresent()
                && encoder.matches(token, user.get().getEmailVerificationToken())
                && !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())
        ) {
            user.get().setEmailVerified(true);
            user.get().setEmailVerificationToken(null);
            user.get().setEmailVerificationTokenExpiryDate(null);

            authenticationUserRepository.save(user.get());
        }

        else if (
                user.isPresent()
                && encoder.matches(token, user.get().getEmailVerificationToken())
                && user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())
        ) {
            throw new IllegalArgumentException("Email verification token expired.");
        }

        else {
            throw new IllegalArgumentException("Email verification token failed.");
        }
    }



    public AuthenticationResponseBody login(AuthenticationRequestBody loginRequestBody) {
        AuthenticationUser user = authenticationUserRepository.findByEmail(loginRequestBody.getEmail()).orElseThrow(() -> new IllegalArgumentException("User not found."));

        if(!encoder.matches(loginRequestBody.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect.");
        }

        String authToken = jsonWebToken.generateToken(loginRequestBody.getEmail());
        return new AuthenticationResponseBody(authToken, "Authentication succeeded.");
    }




    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        AuthenticationUser user = authenticationUserRepository.save(
                new AuthenticationUser(
                        registerRequestBody.getEmail(),
                        encoder.encode(registerRequestBody.getPassword())
                )
        );

        String emailVerificationToken = generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);

        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));

        authenticationUserRepository.save(user);


        String subject = "Email Verification";
        String body = String.format(
                """
                Only one step to take full advantage of ProFile.\n
                Enter this code to verify your email: %s. This code will expire in %s minutes               
                """,
                emailVerificationToken, durationInMinutes
        );

        try {
            emailService.sendEmail(registerRequestBody.getEmail(), subject, body);
        }
        catch (Exception e) {
            logger.info("Error while sending email: {}", e.getMessage());
        }


        String authToken = jsonWebToken.generateToken(registerRequestBody.getEmail());

        return new AuthenticationResponseBody(authToken, "Authentication succeeded.");
    }






    public AuthenticationUser getUser(String email) {
        AuthenticationUser user = authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found."));

        return user;
    }






    @Transactional
    public void deleteUser(Long userId) {
        AuthenticationUser user = entityManager.find(AuthenticationUser.class, userId);

        if(user != null) {
            entityManager.createNativeQuery("DELETE FROM post_likes WHERE user_id = :userId")
                    .setParameter("user_id", userId)
                    .executeUpdate();

            entityManager.remove(user);
        }
    }



    public void sendPasswordResetToken(String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);

        if(user.isPresent()) {
            String passwordResetToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(passwordResetToken);

            user.get().setPasswordResetToken(hashedToken);
            user.get().setPasswordResetTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());

            String subject = "Password Reset Token";
            String body = String.format(
                    """
                    You requested a password reset.
                    Enter this code to reset your password: %s. The code will expire in %s minutes.
                    """,
                    passwordResetToken, durationInMinutes
            );

            try{
                emailService.sendEmail(email, subject, body);
            }
            catch (Exception e) {
                logger.info("Error while sending email: {}", e.getMessage());
            }
        }

        else {
            throw new IllegalArgumentException("User not found.");
        }
    }




    public void resetPassword(String email, String newPassword, String token) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);

        if(
            user.isPresent()
            && encoder.matches(token, user.get().getPasswordResetToken())
            && !user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())
        ) {
            user.get().setPasswordResetToken(null);
            user.get().setPasswordResetTokenExpiryDate(null);
            user.get().setPassword(newPassword);

            authenticationUserRepository.save(user.get());
        }

        else if(
            user.isPresent()
            && encoder.matches(token, user.get().getPasswordResetToken())
            && user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())
        ) {
            throw new IllegalArgumentException("Password Reset Token is expired.");
        }

        else {
            throw new IllegalArgumentException("Password Reset Token not valid.");
        }
    }




    public AuthenticationUser updateUserProfile(
            Long userId,
            String firstName,
            String lastName,
            String company,
            String position,
            String location
    ) {
        // AuthenticationUser user = entityManager.find(AuthenticationUser.class, userId);
        AuthenticationUser user = authenticationUserRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("User not found.")
        );

        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (company != null) user.setCompany(company);
        if (position != null) user.setPosition(position);
        if (location != null) user.setLocation(location);

        return user;
    }




    public List<AuthenticationUser> getUsersWithoutAuthenticated(AuthenticationUser user) {
        return authenticationUserRepository.findAllByIdNot(user.getId());
    }


    public AuthenticationUser getUserById(Long userId) {
        return authenticationUserRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("User not found.")
        )
    }



}
