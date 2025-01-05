package com.profile.profile.features.authentication.filter;

import com.profile.profile.features.authentication.model.AuthenticationUser;
import com.profile.profile.features.authentication.service.AuthenticationService;
import com.profile.profile.features.authentication.utils.JsonWebToken;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class AuthenticationFilter extends HttpFilter {

    private final List<String> unsecuredEndpoints = Arrays.asList(
            "/api/v1/authentication/login",
            "/api/v1/authentication/register",
            "/api/v1/authentication/send-password-reset-token",
            "/api/v1/authentication/reset-password"
    );

    private final JsonWebToken jsonWebTokenService;
    private final AuthenticationService authenticationService;

    public AuthenticationFilter(JsonWebToken jsonWebToken, AuthenticationService authenticationService) {
        this.jsonWebTokenService = jsonWebToken;
        this.authenticationService = authenticationService;
    }


    @Override
    protected void doFilter(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


        if("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }






        String path = request.getRequestURI();
        if(unsecuredEndpoints.contains(path)) {
            chain.doFilter(request, response);
            return;
        }



        try {
            String authorization = request.getHeader("Authorization");
            if(authorization == null || !authorization.startsWith("Bearer ")) {
                throw new ServletException("Token is missing.");
            }

            String token = authorization.substring(7);
            if (jsonWebTokenService.isTokenExpired(token)) {
                throw new ServletException("Token is expired.");
            }

            String email = jsonWebTokenService.getEmailFromToken(token);
            AuthenticationUser user = authenticationService.getUser(email);
            request.setAttribute("Authenticated User", user);
            chain.doFilter(request, response);
        }

        catch(Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"message\": \"Invalid authentication token, or token missing.\"}"
            );
        }
    }


}
