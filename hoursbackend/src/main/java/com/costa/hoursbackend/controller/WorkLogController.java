package com.costa.hoursbackend.controller;

import com.costa.hoursbackend.dto.WorkLogDTO;
import com.costa.hoursbackend.model.WorkLog;
import com.costa.hoursbackend.service.WorkLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worklogs")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkLogController {

    @Autowired
    private WorkLogService service;

    @PostMapping
    public ResponseEntity<WorkLog> add(@RequestBody WorkLog log){
        return ResponseEntity.ok(service.addWorkLog(log));
    }

    @GetMapping
    public ResponseEntity<List<WorkLogDTO>> getMonthly(
            @RequestParam int year,
            @RequestParam int month){
        return ResponseEntity.ok(service.getWorkLogsByMonthYear(year, month));
    }
}
