package com.profile.profile.features.authentication.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JsonWebToken {
    @Value("${jwt.secret.key}")
    private String secret;


    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }


    // Use the jwt secret key to geenrate a token. This is the token that'll be sent to users email
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getKey())
                .compact();
    }


    // Each generated token holds json information about a user. We want to use this method to extract the JSON information of the user
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // this is just to get a single information from the claim we extracted in the above method. See the methods below it to see how we'll use it. We pass in the token value and pecify the information we want to extract "Claims::getSubject"
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


    public String getEmailFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

}
