package com.costa.hoursbackend.controller;

import com.costa.hoursbackend.model.WorkLog;
import com.costa.hoursbackend.repository.WorkLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/worklogs")
public class WorkLogController {

    @Autowired
    private WorkLogRepository repository;

    @PostMapping
    public WorkLog add(@RequestBody WorkLog log){
        return repository.save(log);
    }

    @GetMapping
    public List<WorkLog> getMonthly(@RequestParam int year, @RequestParam int month){
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return repository.findByDateBetween(start, end);
    }

}
