package com.lostandfound.LostAndFound;

import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class LostAndFoundApplication {
  public static void main(String[] args) {
    SpringApplication.run(LostAndFoundApplication.class, args);
  }

  @Bean
  public Filter corsFilter() {

    return new Filter() {

      @Override
      public void init(FilterConfig filterConfig) {
        // doesn't need any special setup.
      }

      @Override
      public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {

        try {
          HttpServletResponse response = (HttpServletResponse) res;
          response.setHeader("Access-Control-Allow-Origin", "*");
          response.setHeader("Access-Control-Allow-Credentials", "true");
          response.setHeader(
              "Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT,PATCH");
          response.setHeader("Access-Control-Max-Age", "3600");
          response.setHeader("Access-Control-Allow-Headers", "*");
          response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

          chain.doFilter(req, res);
        } catch (Exception e) {
          throw new LostAndFoundException(
              e.getMessage() + ": occured while configuring CORS filters");
        }
      }

      @Override
      public void destroy() {
        // doesn't required clean up.
      }
    };
  }
}
