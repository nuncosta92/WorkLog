package com.costa.hoursbackend.service;

import com.costa.hoursbackend.dto.WorkLogDTO;
import com.costa.hoursbackend.model.WorkLog;
import com.costa.hoursbackend.repository.WorkLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WorkLogService {

    private static final Logger logger = LoggerFactory.getLogger(WorkLogService.class);

    @Autowired
    private WorkLogRepository repository;

    // Adiciona log recebido do frontend
    public WorkLog addWorkLog(WorkLog log){
        logger.info("Adding new work log: {}", log.getNotes());
        return repository.save(log);
    }

    // Retorna logs filtrados por mês e ano
    public List<WorkLogDTO> getWorkLogsByMonthYear(int year, int month){
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<WorkLog> logs = repository.findByDateBetween(start, end);
        logger.info("Fetched {} logs for {}/{}", logs.size(), month, year);

        return logs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private WorkLogDTO convertToDTO(WorkLog log){
        return new WorkLogDTO(
                log.getId(),
                log.getDate(),
                log.getStartTime(),
                log.getEndTime(),
                log.getTotalHours(),
                log.getNotes()
        );
    }
}
