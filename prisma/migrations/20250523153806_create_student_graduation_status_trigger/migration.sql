-- This is an empty migration.

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION upsert_graduation_status_after_student_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the operation is an INSERT or an UPDATE on the Student table
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "GraduationStatus" ("studentId", "status", "createdAt", "updatedAt")
        VALUES (NEW.id, 'SYSTEM_APPROVAL', NOW(), NOW())
        ON CONFLICT ("studentId") DO UPDATE SET
        status = 'SYSTEM_APPROVAL',
        "updatedAt" = NOW();
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Optionally, you might only want to update if certain fields change,
        -- or always update/ensure the GraduationStatus exists
        INSERT INTO "GraduationStatus" ("studentId", "status", "createdAt", "updatedAt")
        VALUES (NEW.id, 'SYSTEM_APPROVAL', NOW(), NOW())
        ON CONFLICT ("studentId") DO UPDATE SET
        status = 'SYSTEM_APPROVAL',
        "updatedAt" = NOW();
    END IF;
    RETURN NEW; -- For AFTER triggers, the return value is ignored, but it's good practice.
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the Student table
-- This trigger will fire AFTER every INSERT or UPDATE operation on the Student table
CREATE TRIGGER student_after_change_trigger
AFTER INSERT OR UPDATE ON "Student"
FOR EACH ROW
EXECUTE FUNCTION upsert_graduation_status_after_student_change();

-- Drop trigger and function if needed (for rollback or re-creation)
-- DROP TRIGGER IF EXISTS student_after_change_trigger ON "Student";
-- DROP FUNCTION IF EXISTS upsert_graduation_status_after_student_change();