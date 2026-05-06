package com.resumeprojects.ExpenceManager.service;

import com.resumeprojects.ExpenceManager.dto.ExpenseDTO;
import com.resumeprojects.ExpenceManager.entity.ProfileEntity;
import com.resumeprojects.ExpenceManager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value; // ✅ FIX 1: Correct Spring @Value import
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

// ✅ FIX 11: Removed unused imports (LinkStyle, ZoneId, lombok.Value)

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    // ✅ FIX 10: Changed zone "IST" → "Asia/Kolkata" (valid IANA timezone)
    @Scheduled(cron = "0 0 22 * * *", zone = "Asia/Kolkata")
    public void sendDailyIncomeExpenseRemainder() {
        log.info("Job started: sendDailyExpenseRemainder");

        // ✅ FIX 2: Renamed 'profile' → 'profiles' to match for-each loop
        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {
            // ✅ FIX 3: Fixed malformed HTML anchor tag string
            String body = "Hi " + profile.getFullname() + ",<br><br>"
                    + "This is a friendly reminder to add your income and expenses for today in MoneyManager.<br><br>"
                    + "<a href='" + frontendUrl + "' style='display:inline-block;"
                    + "padding:10px 20px;background-color:#4CAF50;color:white;'>"
                    + "Add Now</a>";
            emailService.sendEmail(
                    profile.getEmail(),
                    "Daily Reminder: Add your income and expenses",
                    body);
        }
        log.info("Job finished: sendDailyExpenseRemainder");
    }

    // ✅ FIX 10: Changed zone "IST" → "Asia/Kolkata"
    @Scheduled(cron = "0 0 23 * * *", zone = "Asia/Kolkata")
    public void sendDailyExpenseSummary() {
        log.info("Job started: sendDailyExpenseSummary");

        List<ProfileEntity> profiles = profileRepository.findAll();

        // ✅ FIX 4: Fixed for-each syntax '=' → ':'
        for (ProfileEntity profile : profiles) {

            // ✅ FIX 5: Renamed 'list' → 'todaysExpenses' for consistency
            List<ExpenseDTO> todaysExpenses = expenseService
                    .getExpensesForUserOnDate(profile.getId(), LocalDate.now());

            if (!todaysExpenses.isEmpty()) {
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse:collapse;width:100%;'>");
                // ✅ FIX 6: Fixed malformed <tr> header row with proper HTML
                table.append("<tr style='background-color:#f2f2f2;'>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>#</th>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>Name</th>")
                        .append("<th style='border:1px solid #ddd;padding:8px;'>Amount</th>")
                        .append("</tr>");

                int i = 1;
                for (ExpenseDTO expense : todaysExpenses) {
                    table.append("<tr>");
                    // ✅ FIX 7: Changed </td> opening tags → <td>
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>")
                            .append(i++).append("</td>");
                    // ✅ FIX 8: Replaced empty append() with actual content
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>")
                            .append(expense.getName()).append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>")
                            .append(expense.getAmount()).append("</td>");
                    table.append("</tr>");
                }
                table.append("</table>");

                String body = "Hi " + profile.getFullname()
                        + ",<br/><br/> Here is a summary of your expenses for today:"
                        + "<br/><br/>" + table
                        + "<br/><br/>Best regards,<br/>Money Manager Team";

                emailService.sendEmail(
                        profile.getEmail(),
                        "Daily Expenses Summary",
                        body);
            }
        } // ✅ FIX 9: Fixed brace structure — log.info now correctly inside method
        log.info("Job completed: sendDailyExpenseSummary");
    }
}