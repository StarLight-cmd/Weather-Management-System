package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class    CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")                         // any end point
                        .allowedOrigins("http://localhost:5173")   // my front end
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allowed methods
                        .allowedHeaders("*");                      // headers
            }
        };
    }
}
