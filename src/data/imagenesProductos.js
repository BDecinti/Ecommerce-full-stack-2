// Imágenes de los productos, separadas del catálogo para editarlas en un solo lugar.
// La clave es el id del producto (ver data/productos.js) y el valor es la URL de su imagen.
// Si un id no aparece aquí, el producto usa la imagen local que tenga en productos.js.
export const imagenesProductos = {
  // --- Controles ---
  1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyK2nEoym9VArLyeLNJNDby64Mu2LO2K-bF6c5FWbxQw&s=10", // Control DualSense
  20: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRF5mYqO1iD1DDk3XdSHN3uyqQewQxAT-PUDFUBJKjag&s", // Control Xbox
  21: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBaZOxNBDW84Z9Qg1QHUIzzcArloIO-2NbHRDngyobew&s", // 8BitDo Pro 2

  // --- Teclados y mouse ---
  2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSomHwcZtWHb909FlBJK3M5YxMKBnK_bqimxzg2EjNBtw&s=10", // BlackWidow V4
  22: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS65yCbDP0W2RuNcC4NNPxTnR7Jva1bIwbjHXhbTT4nYw&s=10", // Corsair K70
  3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD6nKGMqewq_tko-afQ8blHPNSgps_Oiv-pZBj5d-jpg&s=10", // G502 HERO
  23: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOXRv1GY3tGAYhP83h57bZNId-zKeDL254aNiJ8Lt3lw&s=10", // G Pro X Superlight
  7: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFwbfPhy-4limaNKhsewdGI2704Fj7sbAkqf2QZk87ow&s=10", // Mousepad QcK

  // --- Audio y streaming ---
  4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa22SCcG6y45J8L91EEt3pliVdoURgnA4bSWjufSj6uA&s=10", // Cloud II
  19: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EGsXFIqUdBc5G_uzzrI9VHCfbNwWdSa09uqfW_29tA&s=10", // Kraken X
  8: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbWWTVau34GiJG1fMr3B8SsEZphne785wkd7PXFRQjSA&s=10", // Micrófono Yeti

  // --- Consolas ---
  5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtvlH5D3m9KEq0oZaVkTWeIfkXB0YCJm2pTtyDukieHg&s=10", // PlayStation 5 Slim
  17: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNIuH2oG2P-U5xge2s84eQIqu2whnt7H9aTS-YawJzNA&s=10", // Switch OLED
  18: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQwMLpZCsVcoHKdyqwEhy3lZKd3kw7qVYcdW4Lc1ZfzQ&s=10", // Xbox Series S

  // --- Notebooks ---
  9: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6KRV3wdbcVGkclkT_Cxz0kLKjmedE-CvWwvTBB6r8_g&s=10", // ROG Strix G16
  10: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREz6Rx57GzUmTxX3EjVTCGUXcrlE6d4dE5ISycPPzzOg&s", // IdeaPad Slim 3
  11: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6KRV3wdbcVGkclkT_Cxz0kLKjmedE-CvWwvTBB6r8_g&s=10", // Pavilion 15 (misma URL que el id 9)

  // --- Monitores ---
  12: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2hCP8hl5c7w78S2ynme4GByhWD_sK0ixe33x-rQcpEQ&s=10", // Odyssey G5
  13: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK53uqY5yVWeQMjM4EwpRy5Ki__zAalcuouOv8dOUQ8w&s=10", // UltraGear 24"
  14: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrKitgRAwRKgBNe4nsed0vSJ4RZIITuEP6Ix46tF-A5Q&s", // AOC 24G2

  // --- Sillas gamer ---
  6: "https://cdnx.jumpseller.com/a2-brands/image/75596546/resize/610/610?1775663299", // Titan Evo
  15: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_A5n80R1M3RktkOW7vEkphc4q7LvkWu8GE1vb1IE-IA&s=10", // TC100 Relaxed
  16: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPyk63o3zPI4DzZgFG3fyj5ExDtM1vOD4ADmA3vagR5w&s=10", // Iskur

  // --- Monitores en oferta ---
  24: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdHg1PQfzkiO2_QIJtCTfL8A7lYVyBaYqlY5XjzUhP-Q&s", // LG 27" QHD 200Hz
  25: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFOaHqeuagidEHeHLzshcJ3houI0DrvSz0gd_HTBg1Gg&s=10", // HP Series 5
  26: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHv6GkQVrIPpyeb7W53SumJgdnWxfuer7qYMbITx2Dvg&s", // Master G portátil

  // --- Componentes de PC ---
  27: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGcPOYbhhQtfOoDAM_nlSNMl9CbNT-jAExsdhNT-glbA&s=10", // Memoria Corsair 8GB
  28: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIm2-vyMNUqwSk8dxXftjJFyjZvrkW1XWy4YRNqhI9uA&s=10", // SSD Adata SU650
  29: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2zW5OW4CQdpS6f7wj_AFmG4LugYEo9bebN0V2dgpG2g&s=10", // Ryzen 7 5700G

  // --- Energía y respaldo ---
  30: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ1TF20vtEW3txPQch2IsHRTBd3Az14VuefAkv_PlPYA&s=10", // UPS Cito 750VA
  31: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt5bulWS2xR_lnqlzSpg_8n-b1QaO8S6Je1O4zsUwcfg&s=10", // Generador Forza Titan
  32: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTt9uEg5QHwOHXeBAvtvPJIEBSnZMlBistKPn2OftdeQ&s=10", // UPS Spektra 2000VA
};
