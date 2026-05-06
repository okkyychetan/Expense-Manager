package com.resumeprojects.ExpenceManager.repository;

import com.resumeprojects.ExpenceManager.entity.IncomeEntity;  // ✅ FIX 2: Removed unused ExpenseEntity import
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {  // ✅ FIX 1: Typo Respository → Repository

    // select * from tbl_incomes where profile_id = ? order by date desc
    List<IncomeEntity> findByProfileIdOrderByDateDesc(Long profileId);  // ✅ FIX 3: OrderedBy → OrderBy

    // select * from tbl_incomes where profile_id = ? order by date desc limit 5
    List<IncomeEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);  // ✅ FIX 3: OrderedBy → OrderBy

    @Query("SELECT SUM(i.amount) FROM IncomeEntity i WHERE i.profile.id = :profileId")
    BigDecimal findTotalIncomeByProfileId(@Param("profileId") Long profileId);  // ✅ FIX 4: Expense → Income

    // select * from tbl_incomes where profile_id = ? and date between ?2 and ?3 and name like %?4%
    List<IncomeEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
            Long profileId,       // ✅ FIX 5: Semicolon → Comma
            LocalDate startDate,
            LocalDate endDate,
            String keyword,
            Sort sort
    );

    // select * from tbl_incomes where profile_id = ? and date between ?2 and ?3
    List<IncomeEntity> findByProfileIdAndDateBetween(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate
    );
}