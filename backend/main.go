package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"net/http"
)

type Transaction struct {
	ID          uint    `json:"id" gorm:"primaryKey"`
	Type        string  `json:"type"`        // income / expense
	Category    string  `json:"category"`    // contoh: "Makanan", "Transportasi"
	Amount      float64 `json:"amount"`      // pakai float64 biar cocok dengan double
	Date        string  `json:"date"`        // format "YYYY-MM-DD"
	Note        string  `json:"note"`
	Description string  `json:"description"`
}


var db *gorm.DB

func main() {
	// koneksi MySQL
	dsn := "root:@tcp(127.0.0.1:3306)/keuangan?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db = database
	db.AutoMigrate(&Transaction{})

	r := gin.Default()

	// ambil semua transaksi
	r.GET("/transactions", func(c *gin.Context) {
		var transactions []Transaction
		db.Find(&transactions)
		c.JSON(http.StatusOK, transactions)
	})

	// tambah transaksi baru
	r.POST("/transactions", func(c *gin.Context) {
		var t Transaction
		if err := c.ShouldBindJSON(&t); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		db.Create(&t)
		c.JSON(http.StatusOK, t)
	})

	// update transaksi
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

    // update field sesuai input
    t.Type = input.Type
    t.Category = input.Category
    t.Amount = input.Amount
    t.Date = input.Date
    t.Note = input.Note
    t.Description = input.Description

    db.Save(&t)
    c.JSON(http.StatusOK, t)
})

	// hapus transaksi
	r.DELETE("/transactions/:id", func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Delete(&Transaction{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hapus transaksi"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Transaksi berhasil dihapus"})
	})

	r.Run(":8080") // backend jalan di port 8080
}
