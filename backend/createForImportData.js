const express = require("express");
const app = express();
const readXlsxFile = require("read-excel-file/node");
const multer = require("multer");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
    host: "caboose.proxy.rlwy.net",
    port: 50084,
    database: "railway",
    user: "postgres",
    password: "AtubJXGofjbxXOktxxmfwhEuSiFJOANF",
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Connection error:", err.message);
        return;
    }
    console.log("PostgreSQL connected!");
    release();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });
function convertDate(dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month}-${day}`;
}
// Hodimlarni Excel orqali import qilish — POST /employeeAdd
app.post("/employee", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Fayl yuklanmadi" });
        }

        const rows = await readXlsxFile(req.file.buffer);
        const [header, ...dataRows] = rows;

        const employees = dataRows.map((row) => {
            const obj = {};
            header.forEach((key, index) => {
                obj[key] = row[index] != null ? String(row[index]).trim() : "";
            });
            return obj;
        });

        let imported = 0;
        for (const obj of employees) {
            const firstName = (obj.firstName || obj.Name || obj.ism || "").trim() || "—";
            const lastName = (obj.lastName || obj.LastName || obj.familiya || "").trim();
            const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || firstName;
            const login = (obj.login || obj.Login || "").trim().toLowerCase();
            const plainPassword = (obj.password || obj.Password || obj.parol || "1234").trim();
            if (!login) continue;

            const passwordHash = await bcrypt.hash(plainPassword, 10);
            const phone = (obj.phone || obj.Phone || "").trim() || null;
            const pnfl = (obj.pnfl || obj.PNFL || "").trim() || null;
            const birthDate = convertDate(obj.birthdate || obj.birthDate || obj.Birthdate) || null;
            const passportSeries = (obj.passportSeries || obj.passportSeria || obj.PassportSeria || "").trim() || null;
            const passportNumber = (obj.passportNumber || obj.PassportNumber || "").trim() || null;

            const result = await pool.query(
                `INSERT INTO public.employees 
                    (first_name, last_name, full_name, login, password_hash, phone, pnfl, birth_date, passport_series, passport_number) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 ON CONFLICT (login) DO NOTHING`,
                [
                    firstName,
                    lastName,
                    fullName,
                    login,
                    passwordHash,
                    phone,
                    pnfl,
                    birthDate,
                    passportSeries,
                    passportNumber,
                ]
            );
            if (result.rowCount > 0) imported++;
        }

        return res.status(200).json({
            message: "Hodimlar import qilindi",
            total: employees.length,
            imported,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
    }
});

// Mijozlarni Excel orqali import qilish — POST /employees (customerlar jadvaliga)
app.post("/customers", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Fayl yuklanmadi" });
        }

        const rows = await readXlsxFile(req.file.buffer);
        const [header, ...dataRows] = rows;

        const employees = dataRows.map((row) => {
            const obj = {};
            header.forEach((key, index) => {
                obj[key] = row[index];
            });
            return obj;
        });

        await Promise.all(
            employees.map(async (obj) => {
                const birthdate = convertDate(obj.birhtdate);
                await pool.query(
                    `INSERT INTO public.customers 
                        (full_name, phone, address, "birthDate", passport_series, passport_number, region, district, workplace,first_name) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)`,
                    [
                        obj.Name,
                        obj.Phone,
                        obj.address,
                        birthdate,
                        obj.passportSeria,
                        obj.passportNumber,
                        obj.Region,
                        obj.district,
                        obj.ishjoyi,
                        obj.Name,
                    ]
                );
            })
        );

        return res.status(200).json({
            total: employees.length,
            employees,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
    }
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log("Server running on port " + port);
});