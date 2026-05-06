package com.resumeprojects.ExpenceManager.service;

import com.resumeprojects.ExpenceManager.dto.ExpenseDTO;
import com.resumeprojects.ExpenceManager.dto.IncomeDTO;
import com.resumeprojects.ExpenceManager.dto.RecentTransactionDTO;
import com.resumeprojects.ExpenceManager.entity.ProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// ✅ FIX 4: Removed unused imports (IncomeRespository, IncomeEntity, HashMap)

import static java.util.stream.Stream.concat;

@Service
@RequiredArgsConstructor
public class DashBoardService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    // ✅ FIX 1: Renamed to getdashbBoardData() and removed unused IncomeEntity parameter
    public Map<String, Object> getdashbBoardData() {
        ProfileEntity profile = profileService.getCurrentProfile();
        Map<String, Object> returnValue = new LinkedHashMap<>();

        List<IncomeDTO> latestIncome = incomeService.getLatest5IncomeForCurrentUser();
        List<ExpenseDTO> latestExpenses = expenseService.getLatest5ExpensesForCurrentUser();

        List<RecentTransactionDTO> recentTransaction = concat(
                // ✅ FIX 2: Renamed lambda parameter 'income' → 'incomeDTO' to avoid shadowing
                latestIncome.stream().map(incomeDTO ->
                        RecentTransactionDTO.builder()
                                .id(incomeDTO.getId())
                                .profileId(profile.getId())
                                .icon(incomeDTO.getIcon())
                                .name(incomeDTO.getName())
                                .amount(incomeDTO.getAmount())
                                .date(incomeDTO.getDate())
                                .createdAt(incomeDTO.getCreatedAt())
                                .updatedAt(incomeDTO.getUpdatedAt())
                                .type("income")
                                .build()),
                latestExpenses.stream().map(expense ->
                        RecentTransactionDTO.builder()
                                .id(expense.getId())
                                .profileId(profile.getId())
                                .icon(expense.getIcon())
                                .name(expense.getName())
                                .amount(expense.getAmount())
                                .date(expense.getDate())
                                .createdAt(expense.getCreatedAt())
                                .updatedAt(expense.getUpdatedAt())
                                .type("expense")  // ✅ FIX 3: Was "income", corrected to "expense"
                                .build()))
                .sorted((a, b) -> {
                    int cmp = b.getDate().compareTo(a.getDate());
                    if (cmp == 0 && a.getCreatedAt() != null && b.getCreatedAt() != null) {
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    }
                    return cmp;
                })
                .collect(Collectors.toList());

        returnValue.put("totalBalance", incomeService.getTotalIncomeForCurrentUser()
                .subtract(expenseService.getTotalExpenseForCurrentUser()));
        returnValue.put("totalIncome", incomeService.getTotalIncomeForCurrentUser());
        returnValue.put("totalExpense", expenseService.getTotalExpenseForCurrentUser());
        returnValue.put("recent5Expenses", latestExpenses);
        returnValue.put("recent5Income", latestIncome);
        returnValue.put("recentTransaction", recentTransaction);

        return returnValue;
    }
}