package com.resumeprojects.ExpenceManager.service;

import com.resumeprojects.ExpenceManager.dto.IncomeDTO;
import com.resumeprojects.ExpenceManager.entity.CategoryEntity;
import com.resumeprojects.ExpenceManager.entity.IncomeEntity;
import com.resumeprojects.ExpenceManager.entity.ProfileEntity;
import com.resumeprojects.ExpenceManager.repository.CategoryRepository;
import com.resumeprojects.ExpenceManager.repository.IncomeRepository;
// ✅ FIX 11: Removed unused imports (ExpenseDTO, ExpenseEntity)
// ✅ FIX 1/2: Using correct spelling IncomeRepository, CategoryRepository
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    // ✅ FIX 1: Fixed typo categoryRespository → categoryRepository
    private final CategoryRepository categoryRepository;
    // ✅ FIX 2: Fixed typo incomeRespository → incomeRepository
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;

    // Add a new income to the database
    // ✅ FIX 3: Renamed parameter expenseDTO → incomeDTO, fixed all usages of dto
    public IncomeDTO addIncome(IncomeDTO incomeDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(incomeDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity newIncome = toEntity(incomeDTO, profile, category);
        newIncome = incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    // Retrieve all income for the current month
    public List<IncomeDTO> getCurrentMonthIncomeForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        // ✅ FIX 4: Added missing semicolon
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(
                profile.getId(), startDate, endDate);
        return list.stream().map(this::toDTO).toList();
    }

    // Delete income by id for current user
    public void deleteIncome(Long incomeId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        // ✅ FIX 5: Changed ExpenseEntity → IncomeEntity
        // ✅ FIX 6: Changed orElse() → orElseThrow()
        IncomeEntity entity = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        if (!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this income");
        }
        // ✅ FIX 7: Changed deleteById(entity) → deleteById(incomeId)
        incomeRepository.deleteById(incomeId);
    }

    // ✅ FIX 8: Renamed to getLatest5IncomeForCurrentUser() to match DashBoardService call
    public List<IncomeDTO> getLatest5IncomeForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        // ✅ FIX 9: Changed OrderedByDateDesc → OrderByDateDesc
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    // Get the total income of current user
    public BigDecimal getTotalIncomeForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        // ✅ FIX 10: Changed findTotalExpenseByProfileId → findTotalIncomeByProfileId
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    // Filter incomes
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate,
                                         String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository
                .findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                        profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::toDTO).toList();
    }

    // Helper methods
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private IncomeDTO toDTO(IncomeEntity entity) {
        return IncomeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .amount(entity.getAmount())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}