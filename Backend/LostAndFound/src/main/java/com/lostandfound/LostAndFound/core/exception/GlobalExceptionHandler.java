package com.lostandfound.LostAndFound.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler({LostAndFoundException.class})
  public ResponseEntity<Object> handleLostAndFoundException(LostAndFoundException exception) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
  }

  @ExceptionHandler({LostAndFoundValidationException.class})
  public ResponseEntity<Object> handleLostAndFoundException(
      LostAndFoundValidationException exception) {
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(exception.getMessage());
  }

  @ExceptionHandler({LostAndFoundNotFoundException.class})
  public ResponseEntity<Object> handleLostAndFoundNotFoundException(
      LostAndFoundNotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
  }
}
