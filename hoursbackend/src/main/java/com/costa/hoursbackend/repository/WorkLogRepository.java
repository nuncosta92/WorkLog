package com.costa.hoursbackend.repository;

import com.costa.hoursbackend.model.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {

    List<WorkLog> findByDateBetween(LocalDate star, LocalDate end);

}
