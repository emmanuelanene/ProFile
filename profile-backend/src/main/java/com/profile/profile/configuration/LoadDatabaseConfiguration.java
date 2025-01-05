package com.profile.profile.configuration;

import com.profile.profile.features.authentication.model.AuthenticationUser;
import com.profile.profile.features.authentication.repository.AuthenticationUserRepository;
import com.profile.profile.features.authentication.utils.Encoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import java.util.List;

public class LoadDatabaseConfiguration {
    public final Encoder encoder;

    public LoadDatabaseConfiguration(Encoder encoder) {
        this.encoder = encoder;
    }

    @Bean
    public CommandLineRunner initDatabase(
            AuthenticationUserRepository authenticationUserRepository
    ) {
        return args -> {
            List<AuthenticationUser> users = createUsers(authenticationUserRepository);
        };
    }


    private AuthenticationUser createUser(
            String email,
            String password,
            String firstName,
            String lastName,
            String position,
            String company,
            String location,
            String profilePicture
    ) {
        AuthenticationUser newUser = new AuthenticationUser();

        newUser.setEmail(email);
        newUser.setPassword(encoder.encode(password));
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setPosition(position);
        newUser.setCompany(company);
        newUser.setLocation(location);
        newUser.setProfilePicture(profilePicture);

        return newUser;
    }


    private List<AuthenticationUser> createUsers(
            AuthenticationUserRepository authenticationUserRepository
    ) {
        List<AuthenticationUser> users = List.of(
                createUser(
                        "john.doe@example.com",
                        "john",
                        "John",
                        "Doe",
                        "Software Engineer",
                        "Docker Inc.",
                        "San Francisco, CA",
                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ),

                createUser(
                        "anne.claire@example.com",
                        "anne",
                        "Anne",
                        "Claire",
                        "HR Manager",
                        "eToro",
                        "Paris, Fr",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ),
                createUser(
                        "arnauld.manner@example.com",
                        "arnauld",
                        "Arnauld",
                        "Manner",
                        "Product Manager",
                        "Arc",
                        "Dakar, SN",
                        "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?q=80&w=2725&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ),


                createUser(
                        "moussa.diop@example.com",
                        "moussa",
                        "Moussa",
                        "Diop",
                        "Software Engineer",
                        "Orange",
                        "Bordeaux, FR",
                        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ),


                createUser(
                        "awa.diop@example.com",
                        "awa",
                        "Awa",
                        "Diop",
                        "Data Scientist",
                        "Zoho",
                        "New Delhi, IN",
                        "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                )
        );

        authenticationUserRepository.saveAll(users);
        return users;
    }
}
