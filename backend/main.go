package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Model transaksi
type Transaction struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Description string    `json:"description"`
	Amount      float64   `json:"amount"`
	Date        time.Time `json:"date"`
}

var DB *gorm.DB

// Koneksi database
func initDB() {
	dsn := "root:@tcp(127.0.0.1:3306)/finance_db?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Gagal koneksi database")
	}

	// Migrasi tabel
	database.AutoMigrate(&Transaction{})
	DB = database
}

func main() {
	initDB()
	r := gin.Default()

	// GET semua transaksi
	r.GET("/transactions", func(c *gin.Context) {
		var transactions []Transaction
		DB.Find(&transactions)
		c.JSON(http.StatusOK, transactions)
	})

	// POST tambah transaksi
	r.POST("/transactions", func(c *gin.Context) {
		var transaction Transaction
		if err := c.ShouldBindJSON(&transaction); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		DB.Create(&transaction)
		c.JSON(http.StatusOK, transaction)
	})

	// PUT update transaksi
	r.PUT("/transactions/:id", func(c *gin.Context) {
		var transaction Transaction
		id := c.Param("id")
		if err := DB.First(&transaction, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}
		if err := c.ShouldBindJSON(&transaction); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		DB.Save(&transaction)
		c.JSON(http.StatusOK, transaction)
	})

	// DELETE hapus transaksi
	r.DELETE("/transactions/:id", func(c *gin.Context) {
		id := c.Param("id")
		DB.Delete(&Transaction{}, id)
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
	})

	// Jalankan server
	r.Run(":8080")
}
