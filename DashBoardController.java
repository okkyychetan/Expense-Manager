package com.resumeprojects.ExpenceManager.controller;

import com.resumeprojects.ExpenceManager.service.DashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")  // ✅ FIX 1: Added base path
@RequiredArgsConstructor
public class DashBoardController {

    private final DashBoardService dashBoardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashBoardData() {
        Map<String, Object> dashboardData = dashBoardService.getdashbBoardData();
        return ResponseEntity.ok(dashboardData);
    }
}