package com.resumeprojects.ExpenceManager.controller;

import com.resumeprojects.ExpenceManager.dto.ExpenseDTO;
import com.resumeprojects.ExpenceManager.dto.FilterDTO;
import com.resumeprojects.ExpenceManager.dto.IncomeDTO;
import com.resumeprojects.ExpenceManager.service.ExpenseService;
import com.resumeprojects.ExpenceManager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")

public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping("/filter")
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter){
        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
        String keyword = filter.getKeyword() != null ? filter.getKeyword():"";
        String sortField = filter.getSortField() != null ? filter.getSortField():"date";
        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);
        if ("income".equals(filter.getType())) {
            List<IncomeDTO> income = incomeService.filterIncomes(startDate, endDate, keyword, sort);
            return ResponseEntity.ok(income);
        } else if ("expense".equalsIgnoreCase(filter.getType())) {
            List<ExpenseDTO> expenses = expenseService.filterExpenses(startDate, endDate, keyword, sort);
            return ResponseEntity.ok(expenses);
        }else {
            return ResponseEntity.badRequest().body("Invalid type. Must be 'income' or 'expense'");// timestamp 4:46:16
        }
    }
}
