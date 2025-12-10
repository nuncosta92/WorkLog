package com.costa.hoursbackend.repository;

import com.costa.hoursbackend.model.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {
    List<WorkLog> findByDateBetween(LocalDate start, LocalDate end);
}
