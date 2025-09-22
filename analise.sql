-- Total de horas que cada professor tem comprometido em aulas
SELECT 
    p.id AS professor_id,
    p.name AS professor_name,
    SUM(TIMESTAMPDIFF(HOUR, cs.start_time, cs.end_time)) AS total_hours
FROM PROFESSOR p
JOIN SUBJECT s ON s.taught_by = p.id
JOIN CLASS c ON c.subject_id = s.id
JOIN CLASS_SCHEDULE cs ON cs.class_id = c.id
GROUP BY p.id, p.name
ORDER BY total_hours DESC;

-- Lista de salas com horários livres e ocupados
SELECT 
    r.id AS room_id,
    r.name AS room_name,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    'Ocupada' AS status
FROM ROOM r
JOIN CLASS_SCHEDULE cs ON cs.room_id = r.id
ORDER BY r.id, cs.day_of_week, cs.start_time;
