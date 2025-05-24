-- Create function to automatically create diploma when graduation status is COMPLETED
CREATE OR REPLACE FUNCTION create_diploma_on_graduation()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the new status is COMPLETED and there's no existing diploma
    IF NEW.status = 'COMPLETED' AND NOT EXISTS (
        SELECT 1 FROM "Diploma" WHERE "studentId" = NEW."studentId"
    ) THEN
        INSERT INTO "Diploma" ("studentId", "issueDate")
        VALUES (NEW."studentId", NOW());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after insert or update on GraduationStatus
CREATE TRIGGER graduation_diploma_trigger
    AFTER INSERT OR UPDATE ON "GraduationStatus"
    FOR EACH ROW
    EXECUTE FUNCTION create_diploma_on_graduation();