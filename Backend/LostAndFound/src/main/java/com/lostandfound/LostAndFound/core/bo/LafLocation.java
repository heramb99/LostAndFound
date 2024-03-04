package com.lostandfound.LostAndFound.core.bo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LafLocation {
  private Double x;
  private Double y;
  private Double radius;
}
