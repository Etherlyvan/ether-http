# ether-http

Server HTTP/1.1 sederhana yang dibangun dengan **TypeScript dan `node:net`**, tanpa `node:http` atau framework. Proyek ketiga dalam Engineering Journey: memahami bagaimana byte TCP menjadi request dan response HTTP.

## Menjalankan

Gunakan Node.js 24 dan npm.

```sh
npm ci
npm run dev
```

Server berjalan di `http://127.0.0.1:3000`. Variabel lingkungan `PORT` dapat mengubah port.

```sh
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/about
curl -X POST http://127.0.0.1:3000/echo --data-binary "hello TCP"
curl -I http://127.0.0.1:3000/
```

Di Windows PowerShell, gunakan `curl.exe` jika `curl` merupakan alias PowerShell.

```sh
npm run check
npm test
npm run build
npm start
```

## Alur request

`TCP socket → buffer → parser → router → handler → serializer → TCP socket`

- `src/parser.ts`: validasi request line, header, dan body berbasis Content-Length.
- `src/router.ts`: routing berdasarkan method dan path; query tidak ikut pencocokan. GET mendukung HEAD otomatis.
- `src/response.ts`: membentuk status line, header, dan body; menghitung panjang dalam byte.
- `src/server.ts`: mengumpulkan potongan TCP, memberi batas ukuran dan timeout, lalu menutup koneksi setelah satu response.
- `src/app.ts`: endpoint GET `/`, GET `/health`, GET `/about`, dan POST `/echo`.
- `src/index.ts`: menjalankan server dan menangani sinyal penghentian.

Tambahkan endpoint melalui `router.on('GET', '/path', handler)`. Handler boleh asynchronous dan mengembalikan `{ status, headers, body }`. Helper `json()` membentuk response JSON. Status response yang tersedia tercantum di `src/response.ts`.

Endpoint `/about` mengembalikan informasi proyek:

```json
{"name":"ether-http","author":"etherlyvan"}
```

Untuk mencobanya di PowerShell, jalankan `npm run dev`, lalu buka terminal kedua:

```powershell
curl.exe -i http://127.0.0.1:3000/about
curl.exe -I http://127.0.0.1:3000/about
curl.exe -i -X POST http://127.0.0.1:3000/about
```

Hasilnya berurutan: 200 dengan JSON, 200 tanpa body, dan 405 dengan `Allow: GET, HEAD`.

## Konsep yang dipelajari

TCP adalah aliran byte: satu request bisa tiba dalam beberapa event `data`. Parser mengembalikan `null` sampai header dan body lengkap. Content-Length dihitung sebagai byte, sehingga karakter seperti `é` membutuhkan dua byte UTF-8. HEAD mengirim panjang body yang sama dengan GET tetapi tanpa body.

Header dibatasi 16 KiB, body 1 MiB, dan socket memiliki idle timeout 10 detik. Request tidak valid mendapatkan 400; body terlalu besar 413; header terlalu besar 431. Path yang tidak ditemukan mendapat 404, method yang tidak cocok mendapat 405 dengan header Allow. Error handler menghasilkan 500 tanpa membocorkan detail internal.

## Batasan

Ini proyek belajar, belum server untuk produksi. Hanya HTTP/1.1 dengan target berbentuk `/path` yang didukung. Setiap koneksi menangani satu request dan mengirim `Connection: close`; byte request tambahan tidak diproses. Tidak ada keep-alive, pipelining, TLS, streaming, chunked encoding, kompresi, atau route parameter. Transfer-Encoding ditolak dengan 501 dan Expect dengan 417. Semua nama header ganda ditolak untuk menyederhanakan framing, termasuk header yang sebenarnya boleh berulang dalam HTTP. Host wajib ada, tetapi validasi lengkap sintaks authority belum diterapkan. Timeout adalah batas idle, bukan batas total durasi request.

Pengujian mencakup parsing parsial, UTF-8, framing ambigu, batas ukuran, header injection, serta integrasi socket TCP untuk routing, HEAD, request terpotong, dan kegagalan handler.
