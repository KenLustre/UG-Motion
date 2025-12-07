import * as SQLite from 'expo-sqlite';
export interface User {
    id: number;
    name: string;
    email: string | null;
    age: string;
    sex: 'Male' | 'Female' | 'N/A';
    height: string;
    weight: string;
    password?: string | null; 
    profileImageUri: string | null;
    selectedEquipment: string; 
}
export interface DayPlan {
    id: number;
    day: string;
    focus: string;
    activities: RoutineActivity[];
}
export interface RoutineActivity {
    id: number;
    plan_day_id: number;
    name: string;
    sets: number;
    reps: number;
}
export interface WorkoutLog {
    id: number;
    routine_activity_id: number;
    date: string; 
    weight: number;
    reps: number;
    completed: boolean;
}
const db = SQLite.openDatabaseSync('ugmotion.db');

export const initDatabase = () => {
    db.withTransactionSync(() => {
        db.execSync('PRAGMA foreign_keys = ON;');
        db.execSync(
            `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    email TEXT,
                    age TEXT,
                    sex TEXT,
                    height TEXT,
                    weight TEXT,
                    password TEXT,
                    profileImageUri TEXT, 
                    selectedEquipment TEXT
                );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS plan_days (
                    id INTEGER PRIMARY KEY NOT NULL,
                    day_name TEXT NOT NULL,
                    focus TEXT
                );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS routine_activities (
                    id INTEGER PRIMARY KEY NOT NULL,
                    plan_day_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    sets INTEGER NOT NULL,
                    reps INTEGER NOT NULL,
                    FOREIGN KEY (plan_day_id) REFERENCES plan_days (id) ON DELETE CASCADE
                );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS workout_logs (
                    id INTEGER PRIMARY KEY NOT NULL,
                    routine_activity_id INTEGER,
                    date TEXT NOT NULL,
                    weight REAL,
                    reps INTEGER,
                    completed INTEGER DEFAULT 0,
                    FOREIGN KEY (routine_activity_id) REFERENCES routine_activities (id) ON DELETE SET NULL
                );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS water_logs (
                    id INTEGER PRIMARY KEY NOT NULL,
                    date TEXT NOT NULL,
                    amount_ml INTEGER NOT NULL
                );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS food_logs (
                    id INTEGER PRIMARY KEY NOT NULL,
                    date TEXT NOT NULL,
                    meal_type TEXT NOT NULL,
                    food_name TEXT NOT NULL,
                    calories INTEGER NOT NULL,
                    protein_g REAL,
                    carbs_g REAL,
                    fat_g REAL
                );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS daily_goals (
                    date TEXT PRIMARY KEY NOT NULL,
                    water_target INTEGER,
                    calorie_target INTEGER,
                    protein_target INTEGER
                );`
        );

        const columns = db.getAllSync<any>('PRAGMA table_info(daily_goals);');
        const hasProteinTarget = columns.some(column => column.name === 'protein_target');
        if (!hasProteinTarget) {
            db.execSync('ALTER TABLE daily_goals ADD COLUMN protein_target INTEGER;');
        }

        const adminUser = db.getFirstSync<User>('SELECT id FROM users WHERE name = ?;', ['Admin']);
        if (!adminUser) {
            db.runSync(`INSERT INTO users (name, email, age, sex, height, weight, profileImageUri, selectedEquipment, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                ['Admin', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', null, '[]', 'Admin123'],
            );
        }
    });
};

export const fetchUserProfile = (): User => {
    const user = db.getFirstSync<User>('SELECT * FROM users LIMIT 1;');
    return user!;
};

export const saveUserProfile = (user: User): void => {
    db.runSync(`UPDATE users SET name = ?, email = ?, age = ?, sex = ?, height = ?, weight = ?, profileImageUri = ?, selectedEquipment = ? WHERE id = ?;`, 
        [user.name, user.email, user.age, user.sex, user.height, user.weight, user.profileImageUri, user.selectedEquipment, user.id]
    );
};

export const fetchAllUsers = (): User[] => {
    return db.getAllSync<User>('SELECT * FROM users;');
};

export const fetchUserForLogin = (name: string): User | null => {
    return db.getFirstSync<User>('SELECT * FROM users WHERE name = ? COLLATE NOCASE LIMIT 1;', [name]);
};

export const fetchUserById = (userId: number): User | null => {
    return db.getFirstSync<User>('SELECT * FROM users WHERE id = ?;', [userId]);
};

export const updateUserPassword = (userId: number, newPass: string): void => {
    db.runSync('UPDATE users SET password = ? WHERE id = ?;', [newPass, userId]);
};

export const deleteUserById = (userId: number): void => {
    db.runSync('DELETE FROM users WHERE id = ?;', [userId]);
};

export const addUser = (name: string, password: string): User | null => {
    const result = db.runSync(
        `INSERT INTO users (name, password, email, age, sex, height, weight, profileImageUri, selectedEquipment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [name, password, null, 'N/A', 'N/A', 'N/A', 'N/A', null, '[]']
    );
    const newUserId = result.lastInsertRowId;
    if (newUserId) {
        return db.getFirstSync<User>('SELECT * FROM users WHERE id = ?;', [newUserId]);
    }
    return null;
};

export const saveWeeklyPlan = (plan: DayPlan[]): void => {
    db.withTransactionSync(() => {
        db.execSync('DELETE FROM routine_activities;');
        db.execSync('DELETE FROM plan_days;');
        plan.forEach(day => {
            const result = db.runSync('INSERT INTO plan_days (day_name, focus) VALUES (?, ?);', [day.day, day.focus]);
            const dayId = result.lastInsertRowId;
            if (dayId) {
                day.activities.forEach(activity => {
                    db.runSync('INSERT INTO routine_activities (plan_day_id, name, sets, reps) VALUES (?, ?, ?, ?);', [dayId, activity.name, activity.sets || 3, activity.reps || 12]);
                });
            }
        });
    });
};

export const fetchWeeklyPlan = (): DayPlan[] => {
    const days = db.getAllSync<any>('SELECT * FROM plan_days ORDER BY id;');
    if (days.length === 0) {
        return [];
    }
    const fullPlan = days.map(day => {
        const activities = db.getAllSync<RoutineActivity>('SELECT * FROM routine_activities WHERE plan_day_id = ?;', [day.id]);
        return { id: day.id, day: day.day_name, focus: day.focus, activities: activities };
    });
    return fullPlan;
};

export const fetchLogsForDay = (plan_day_id: number, date: string): WorkoutLog[] => {
    return db.getAllSync<WorkoutLog>(`SELECT l.* FROM workout_logs l
                JOIN routine_activities ra ON l.routine_activity_id = ra.id
                WHERE ra.plan_day_id = ? AND l.date = ?;`,
        [plan_day_id, date]
    );
};

export const saveWorkoutLog = (log: Omit<WorkoutLog, 'id'>): number => {
    const result = db.runSync('INSERT INTO workout_logs (routine_activity_id, date, weight, reps, completed) VALUES (?, ?, ?, ?, ?);',
        [log.routine_activity_id, log.date, log.weight, log.reps, log.completed ? 1 : 0]);
    return result.lastInsertRowId;
};

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

export const fetchTodayWater = (): number => {
    const today = getTodayDateString();
    const result = db.getFirstSync<{ total: number }>('SELECT SUM(amount_ml) as total FROM water_logs WHERE date = ?;', [today]);
    return result?.total || 0;
};

export const addWaterLog = (amount: number): void => {
    const today = getTodayDateString();
    db.runSync('INSERT INTO water_logs (date, amount_ml) VALUES (?, ?);', [today, amount]);
};

export const fetchTodayCalories = (): number => {
    const today = getTodayDateString();
    const result = db.getFirstSync<{ total: number }>('SELECT SUM(calories) as total FROM food_logs WHERE date = ?;', [today]);
    return result?.total || 0;
};

export const addCalorieLog = (amount: number): void => {
    const today = getTodayDateString();
    db.runSync('INSERT INTO food_logs (date, meal_type, food_name, calories, protein_g) VALUES (?, ?, ?, ?, ?);', [today, 'General', 'Logged Intake', amount, 0]);
};

export const fetchTodayProtein = (): number => {
    const today = getTodayDateString();
    const result = db.getFirstSync<{ total: number }>('SELECT SUM(protein_g) as total FROM food_logs WHERE date = ?;', [today]);
    return result?.total || 0;
};

export const addProteinLog = (amount: number): void => {
    const today = getTodayDateString();
    db.runSync('INSERT INTO food_logs (date, meal_type, food_name, calories, protein_g) VALUES (?, ?, ?, ?, ?);', [today, 'General', 'Logged Intake', 0, amount]);
};

export const fetchDailyGoals = (): { water_target: number | null, calorie_target: number | null, protein_target: number | null } => {
    const today = getTodayDateString();
    const goals = db.getFirstSync<{ water_target: number | null, calorie_target: number | null, protein_target: number | null }>('SELECT water_target, calorie_target, protein_target FROM daily_goals WHERE date = ?;', [today]);
    return goals || { water_target: null, calorie_target: null, protein_target: null };
};

export const saveDailyGoals = (goals: { water_target?: number | null, calorie_target?: number | null, protein_target?: number | null }): void => {
    const today = getTodayDateString();
    db.withTransactionSync(() => {
        db.runSync(
            `INSERT INTO daily_goals (date, water_target, calorie_target, protein_target) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
            water_target = COALESCE(excluded.water_target, water_target),
            calorie_target = COALESCE(excluded.calorie_target, calorie_target),
            protein_target = COALESCE(excluded.protein_target, protein_target);`,
            [today, goals.water_target ?? null, goals.calorie_target ?? null, goals.protein_target ?? null]
        );
    });
};