package com.smartcampus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private String resourceId;
    private String resourceName;
    private String date;
    private String timeRange;
    private String purpose;
    private String phoneNumber;
}
