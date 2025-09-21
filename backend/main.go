package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "log"
    "net/http"
)

type Transaction struct {
    ID       uint    `json:"id" gorm:"primaryKey"`
    Type     string  `json:"type"`
    Category string  `json:"category"`
    Amount   float64 `json:"amount"`
    Date     string  `json:"date"`
    Note     string  `json:"note"`
}

type Summary struct {
    TotalIncome  float64 `json:"totalIncome"`
    TotalExpense float64 `json:"totalExpense"`
    Balance      float64 `json:"balance"`
}

var db *gorm.DB

func main() {
    // Koneksi ke MariaDB (XAMPP)
    dsn := "root:@tcp(127.0.0.1:3306)/keuangan?charset=utf8mb4&parseTime=True&loc=Local"
    database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    db = database

    // Migrasi tabel
    if err := db.AutoMigrate(&Transaction{}); err != nil {
        log.Fatalf("Failed to migrate database: %v", err)
    }
    log.Println("Database migrated successfully")

    r := gin.Default()

    // Konfigurasi CORS (termasuk frontend di 5173)
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Content-Type"},
        AllowCredentials: true,
    }))

    // Endpoint GET semua transaksi
    r.GET("/transactions", func(c *gin.Context) {
        var transactions []Transaction
        if err := db.Find(&transactions).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, transactions)
    })

    // Endpoint POST transaksi
    r.POST("/transactions", func(c *gin.Context) {
        log.Println("Received POST request from:", c.Request.RemoteAddr)
        var t Transaction
        if err := c.ShouldBindJSON(&t); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        if err := db.Create(&t).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, t)
    })

    // Endpoint PUT transaksi
    r.PUT("/transactions/:id", func(c *gin.Context) {
        id := c.Param("id")
        var t Transaction
        if err := db.First(&t, id).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Transaksi tidak ditemukan"})
            return
        }

        var input Transaction
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        t.Type = input.Type
        t.Category = input.Category
        t.Amount = input.Amount
        t.Date = input.Date
        t.Note = input.Note

        if err := db.Save(&t).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, t)
    })

    // Endpoint DELETE transaksi
    r.DELETE("/transactions/:id", func(c *gin.Context) {
        id := c.Param("id")
        if err := db.Delete(&Transaction{}, id).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"message": "Transaksi berhasil dihapus"})
    })

    // Endpoint baru untuk summary
    r.GET("/summary", func(c *gin.Context) {
        var transactions []Transaction
        if err := db.Find(&transactions).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        var totalIncome, totalExpense float64
        for _, t := range transactions {
            if t.Type == "Income" {
                totalIncome += t.Amount
            } else if t.Type == "Expense" {
                totalExpense += t.Amount
            }
        }
        balance := totalIncome - totalExpense

        summary := Summary{
            TotalIncome:  totalIncome,
            TotalExpense: totalExpense,
            Balance:      balance,
        }
        c.JSON(http.StatusOK, summary)
    })

    log.Fatal(r.Run(":8080"))
}