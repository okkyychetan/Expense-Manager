package com.resumeprojects.ExpenceManager.dto;

import lombok.Data;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

@Data
public class FilterDTO {
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String keyword;
    private String sortField;// date, amount, name
    private String sortOrder; // asc or dec
}
