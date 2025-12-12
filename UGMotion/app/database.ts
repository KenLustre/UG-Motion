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
    user_id: number;
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
                name TEXT NOT NULL UNIQUE COLLATE NOCASE,
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
                user_id INTEGER NOT NULL,
                day_name TEXT NOT NULL,
                focus TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
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
                user_id INTEGER NOT NULL,
                routine_activity_id INTEGER,
                date TEXT NOT NULL,
                weight REAL,
                reps INTEGER,
                completed INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (routine_activity_id) REFERENCES routine_activities (id) ON DELETE SET NULL
            );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS water_logs (
                id INTEGER PRIMARY KEY NOT NULL,
                user_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                amount_ml INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );`
        );
        db.execSync(
            `CREATE TABLE IF NOT EXISTS food_logs (
                id INTEGER PRIMARY KEY NOT NULL,
                user_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                meal_type TEXT NOT NULL,
                food_name TEXT NOT NULL,
                calories INTEGER NOT NULL,
                protein_g REAL,
                carbs_g REAL,
                fat_g REAL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );`
        );

        const tablesToMigrate = ['plan_days', 'workout_logs', 'water_logs', 'food_logs'];
        
        tablesToMigrate.forEach(tableName => {
            const tableExists = db.getFirstSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`);
            if (tableExists) {
                const columns = db.getAllSync<any>(`PRAGMA table_info(${tableName});`);
                const hasUserId = columns.some(column => column.name === 'user_id');
                if (!hasUserId) {
                    db.execSync(`ALTER TABLE ${tableName} ADD COLUMN user_id INTEGER;`);
                }
            }
        });

        const dailyGoalsExists = db.getFirstSync("SELECT name FROM sqlite_master WHERE type='table' AND name='daily_goals';");
        if (dailyGoalsExists) {
            const tableInfo = db.getAllSync<any>('PRAGMA table_info(daily_goals);');
            const pkColumns = tableInfo.filter(c => c.pk > 0);
            
            if (pkColumns.length !== 2) {
                db.execSync('DROP TABLE daily_goals;');
            }
        }

        db.execSync(
            `CREATE TABLE IF NOT EXISTS daily_goals (
                    date TEXT NOT NULL,
                    user_id INTEGER NOT NULL,
                    water_target INTEGER,
                    calorie_target INTEGER,
                    protein_target INTEGER,
                    PRIMARY KEY (date, user_id),
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                );`
        );

        const dgColumns = db.getAllSync<any>('PRAGMA table_info(daily_goals);');
        const hasProtein = dgColumns.some(c => c.name === 'protein_target');
        if (!hasProtein) {
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

export const fetchUserProfile = (userId: number): User | null => {
    const user = db.getFirstSync<User>('SELECT * FROM users WHERE id = ?;', [userId]);
    return user;
};

export const saveUserProfile = (user: User): void => {
    db.runSync(`UPDATE users SET name = ?, email = ?, age = ?, sex = ?, height = ?, weight = ?, profileImageUri = ?, selectedEquipment = ? WHERE id = ?;`, 
        [user.name, user.email, user.age, user.sex, user.height, user.weight, user.profileImageUri, user.selectedEquipment, user.id]
    );
};

export const fetchAllUsers = (): User[] => {
    return db.getAllSync<User>('SELECT * FROM users;');
};

export const fetchUsersByNameForLogin = (name: string): User[] => {
    return db.getAllSync<User>('SELECT * FROM users WHERE name = ? COLLATE NOCASE;', [name]);
};

export const fetchUserById = (userId: number): User | null => {
    return db.getFirstSync<User>('SELECT * FROM users WHERE id = ?;', [userId]);
};

export const checkUsernameExists = (name: string, currentUserId?: number): boolean => {
    let query = 'SELECT id FROM users WHERE name = ? COLLATE NOCASE;';
    const params: any[] = [name];

    if (currentUserId) {
        query = 'SELECT id FROM users WHERE name = ? COLLATE NOCASE AND id != ?;';
        params.push(currentUserId);
    }

    const existingUser = db.getFirstSync<{ id: number }>(query, params);
    return !!existingUser;
};


export const updateUserPassword = (userId: number, newPass: string): void => {
    db.runSync('UPDATE users SET password = ? WHERE id = ?;', [newPass, userId]);
};

export const deleteUserById = (userId: number): void => {
    db.withTransactionSync(() => {
        db.runSync('DELETE FROM food_logs WHERE user_id = ?;', [userId]);
        db.runSync('DELETE FROM water_logs WHERE user_id = ?;', [userId]);
        db.runSync('DELETE FROM daily_goals WHERE user_id = ?;', [userId]);
        db.runSync('DELETE FROM workout_logs WHERE user_id = ?;', [userId]);
        db.runSync('DELETE FROM plan_days WHERE user_id = ?;', [userId]);
        db.runSync('DELETE FROM users WHERE id = ?;', [userId]);
    });
};

export const addUser = (name: string, password: string): User | null => {
    try {
        const result = db.runSync(
            `INSERT INTO users (name, password, email, age, sex, height, weight, profileImageUri, selectedEquipment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [name, password, null, 'N/A', 'N/A', 'N/A', 'N/A', null, '[]']
        );
        const newUserId = result.lastInsertRowId;
        if (newUserId) {
            return db.getFirstSync<User>('SELECT * FROM users WHERE id = ?;', [newUserId]);
        }
        return null;
    } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            console.log(`Attempted to create a user with an existing name: ${name}`);
            return null;
        }
        throw error;
    }
};

export const saveWeeklyPlan = (plan: DayPlan[], userId: number): void => {
    db.withTransactionSync(() => {
        const userPlanDays = db.getAllSync<{ id: number }>('SELECT id FROM plan_days WHERE user_id = ?;', [userId]);
        if (userPlanDays.length > 0) { 
            db.runSync('DELETE FROM plan_days WHERE user_id = ?;', [userId]);
        }
        plan.forEach(day => {
            const result = db.runSync('INSERT INTO plan_days (user_id, day_name, focus) VALUES (?, ?, ?);', [userId, day.day, day.focus]);
            const dayId = result.lastInsertRowId;
            if (dayId) {
                day.activities.forEach(activity => {
                    db.runSync('INSERT INTO routine_activities (plan_day_id, name, sets, reps) VALUES (?, ?, ?, ?);', [dayId, activity.name, activity.sets, activity.reps]);
                });
            }
        });
    });
};

export const fetchWeeklyPlan = (userId: number): DayPlan[] => {
    const days = db.getAllSync<any>('SELECT * FROM plan_days WHERE user_id = ? ORDER BY id;', [userId]);
    if (days.length === 0) {
        return [];
    }
    const fullPlan = days.map(day => {
        const activities = db.getAllSync<RoutineActivity>('SELECT * FROM routine_activities WHERE plan_day_id = ?;', [day.id]);
        return { id: day.id, day: day.day_name, focus: day.focus, activities: activities };
    });
    return fullPlan;
};

export const fetchLogsForDay = (plan_day_id: number, date: string, userId: number): WorkoutLog[] => {
    return db.getAllSync<WorkoutLog>(`SELECT l.* FROM workout_logs l
                JOIN routine_activities ra ON l.routine_activity_id = ra.id
                WHERE ra.plan_day_id = ? AND l.date = ? AND l.user_id = ?;`,
        [plan_day_id, date, userId]
    );
};

export const saveWorkoutLog = (log: Omit<WorkoutLog, 'id' | 'user_id'>, userId: number): number => {
    if (!userId) return 0;
    const result = db.runSync('INSERT INTO workout_logs (user_id, routine_activity_id, date, weight, reps, completed) VALUES (?, ?, ?, ?, ?, ?);',
        [userId, log.routine_activity_id, log.date, log.weight, log.reps, log.completed ? 1 : 0]);
    return result.lastInsertRowId;
};

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

export const fetchTodayWater = (userId: number): number => {
    const today = getTodayDateString();
    const result = db.getFirstSync<{ total: number }>('SELECT SUM(amount_ml) as total FROM water_logs WHERE date = ? AND user_id = ?;', [today, userId]);
    return result?.total || 0;
};

export const addWaterLog = (amount: number, userId: number): void => {
    if (!userId) return;
    const today = getTodayDateString();
    db.runSync('INSERT INTO water_logs (user_id, date, amount_ml) VALUES (?, ?, ?);', [userId, today, amount]);
};

export const fetchTodayCalories = (userId: number): number => {
    const today = getTodayDateString();
    const result = db.getFirstSync<{ total: number }>('SELECT SUM(calories) as total FROM food_logs WHERE date = ? AND user_id = ?;', [today, userId]);
    return result?.total || 0;
};

export const addCalorieLog = (amount: number, userId: number): void => {
    if (!userId) return;
    const today = getTodayDateString();
    db.runSync('INSERT INTO food_logs (user_id, date, meal_type, food_name, calories, protein_g) VALUES (?, ?, ?, ?, ?, ?);', [userId, today, 'General', 'Logged Intake', amount, 0]);
};

export const fetchTodayProtein = (userId: number): number => {
    const today = getTodayDateString();
    const result = db.getFirstSync<{ total: number }>('SELECT SUM(protein_g) as total FROM food_logs WHERE date = ? AND user_id = ?;', [today, userId]);
    return result?.total || 0;
};

export const addProteinLog = (amount: number, userId: number): void => {
    if (!userId) return;
    const today = getTodayDateString();
    db.runSync('INSERT INTO food_logs (user_id, date, meal_type, food_name, calories, protein_g) VALUES (?, ?, ?, ?, ?, ?);', [userId, today, 'General', 'Logged Intake', 0, amount]);
};

export const fetchDailyGoals = (userId: number): { water_target: number | null, calorie_target: number | null, protein_target: number | null } => {
    const today = getTodayDateString();
    const goals = db.getFirstSync<{ water_target: number | null, calorie_target: number | null, protein_target: number | null }>('SELECT water_target, calorie_target, protein_target FROM daily_goals WHERE date = ? AND user_id = ?;', [today, userId]);
    return goals || { water_target: null, calorie_target: null, protein_target: null };
};

export const saveDailyGoals = (goals: { water_target?: number | null, calorie_target?: number | null, protein_target?: number | null }, userId: number): void => {
    if (!userId) return;
    const today = getTodayDateString();
    db.withTransactionSync(() => {
        db.runSync(
            `INSERT INTO daily_goals (date, user_id, water_target, calorie_target, protein_target) 
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(date, user_id) DO UPDATE SET
            water_target = COALESCE(excluded.water_target, water_target),
            calorie_target = COALESCE(excluded.calorie_target, calorie_target),
            protein_target = COALESCE(excluded.protein_target, protein_target);`,
            [today, userId, goals.water_target ?? null, goals.calorie_target ?? null, goals.protein_target ?? null]
        );
    });
};

export const debugLogSchema = (): void => {
    console.log('--- ADMIN DATABASE INSPECTION ---');
    const tables = db.getAllSync<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    
    tables.forEach(table => {
        console.log(`\n\n****************************************`);
        console.log(`***   TABLE: ${table.name.toUpperCase()}`);
        console.log(`****************************************`);

        try {
            // Log Schema
            console.log('\n--- SCHEMA ---');
            const columns = db.getAllSync<any>(`PRAGMA table_info(${table.name});`);
            columns.forEach(c => {
                console.log(`- ${c.name}: ${c.type} ${c.notnull ? 'NOT NULL' : ''} ${c.pk ? '(PK)' : ''}`);
            });

            // Log Foreign Keys
            const foreignKeys = db.getAllSync<any>(`PRAGMA foreign_key_list(${table.name});`);
            if (foreignKeys.length > 0) {
                console.log('\n--- FOREIGN KEYS ---');
                foreignKeys.forEach(fk => {
                    console.log(`- Column '${fk.from}' -> ${fk.table}(${fk.to}) | ON DELETE: ${fk.on_delete}`);
                });
            }

            // Log Data
            const rows = db.getAllSync<any>(`SELECT * FROM ${table.name};`);
            console.log(`\n--- DATA (${rows.length} records) ---`);
            if (rows.length > 0) {
                rows.forEach((row, index) => {
                    console.log(`\n[ RECORD ${index + 1} ]`);
                    console.log(JSON.stringify(row, null, 2)); 
                });
            } else {
                console.log('(No records)');
            }
        } catch (error) {
            console.error(`Failed to inspect table ${table.name}:`, error);
        }
    });
    console.log('\n--- END OF DATABASE INSPECTION ---');
};

export const clearAllData = (): void => {
    db.withTransactionSync(() => {
        db.execSync('DELETE FROM workout_logs;');
        db.execSync('DELETE FROM routine_activities;');
        db.execSync('DELETE FROM plan_days;');
        db.execSync('DELETE FROM water_logs;');
        db.execSync('DELETE FROM food_logs;');
        db.execSync('DELETE FROM daily_goals;');
    });
    console.log('--- ALL NON-USER DATA CLEARED ---');
};