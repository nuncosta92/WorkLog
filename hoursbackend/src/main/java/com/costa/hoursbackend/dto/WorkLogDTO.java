package com.costa.hoursbackend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record WorkLogDTO(
        Long id,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        Double totalHours,
        String notes
) {}