<p align="center">
<strong><h2>Qianqian's Homepage</h2></strong>
</p>

![Qianqian's Homepage](/screenshots/main.webp)

### 🎉 Original Features

- [x] Loading animation
- [x] Site introduction
- [x] Hitokoto (One-liners)
- [x] Date and Time
- [x] Real-time Weather
- [x] Time Progress Bar
- [x] Music Player
- [x] Mobile-responsive Design

### 🎉 New Features

- [x] Multi-link support for website list
- [x] Added Tencent Weather API
- [x] Added random non-repeating wallpaper feature (Perfect for perfectionists)
- [x] Removed Music Player (redundant feature)
- [x] Added blur effect to pagination buttons
- [x] Added Moe ICP filing

#### Bug Fixes

- [x] Fixed AutoNavi (Amap) Weather API
- [x] Removed text jumping on web links
- [x] Fixed the bug where pagination buttons were not displayed

---

### ⚙️ Auto Deployment

If you encounter errors in the build environment or packaging process, you can use **GitHub Actions** for automated builds.

1. After successfully **forking** the repository, go to the **Actions** page. If it's your first time, click to enable it as shown below:
   ![Step 1](/screenshots/step1.jpg)
2. Any modifications to the repository will trigger the workflow. Once completed, a downloadable zip file containing the static build files will be generated. You can then upload these to your server.
   ![Step 2](/screenshots/step2.jpg)

---

### ⚙️ Manual Deployment

- **Environment Requirements:** [node.js](https://nodejs.org/)
  > node > 16.16.0  
  > npm > 8.15.0

- Run your terminal (CMD/PowerShell) with **Administrator privileges** and `cd` to the project root directory.
- Execute the following commands:

```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Preview
pnpm dev

# Build
pnpm build
```

> After the build is complete, static assets will be generated in the **`dist` directory**. You can upload the contents of the `dist` folder to your server or use platforms like **Vercel** for one-click import and deployment.

---

### ⚙️ Docker Deployment

> Docker installation and configuration are not covered here.

```bash
# Build
docker build -t home .
# Run
docker run -p 12445:12445 -d home
```

---

### ⚙️ Vercel Deployment

1. Click **Fork** in the upper right corner to copy this repo to your GitHub account.
2. Copy the `/.env.example` file and rename it to `/.env` (**Crucial**).
3. Modify the configurations in `/.env` as needed.
4. Click **Deploy** to finish.

---

### Website Links

Customize your site links in `src/assets/siteLinks.json`:

```json
{
  "home": [
    {
      "icon": "Compass",
      "name": "NginxUI",
      "link": "",
      "ipv4": "https://a.example.com",
      "ipv6": "https://a.example.com",
      "vlan": "http://10.2.1.2:1000",
      "lan": "http://192.168.5.2:1000"
    }
  ]
}
```

You can add icons for these links in `src/components/Links/index.vue`:
*(Choose icons from [xicons.org](https://www.xicons.org), specifically the Font Awesome (fa) set)*

---

### Weather API

Weather and location data require API keys:

- **AutoNavi (Amap):** Create a "Web Service" Key at [Amap Open Platform](https://console.amap.com/dev/index) and add it to `VITE_GD_WEATHER_KEY` in `.env`.
- **Tencent Maps:** Create a "Web Service" Key at [Tencent LBS](https://lbs.qq.com/) and add it to `VITE_TX_WEATHER_KEY` in `.env`.

### Music

This feature is removed by default but the code is preserved. To re-enable it, uncomment the music-related lines in the `.env` file.

### Fonts

Currently uses the **HarmonyOS Sans** open-source font. Font splitting is implemented to improve loading speeds.

<details>
<summary>Legacy Font Optimization Method</summary>

If you use custom Chinese fonts, compression is recommended:

1. Install Python 3.7+ and run `pip install fonttools`.
2. Download [sc_unicode.txt](https://gist.githubusercontent.com/imaegoo/d64e5088b723c2e02c40985f55ff12db/raw/5ebd2ce49418c73459a9dfe050483409306a6c1d/sc_unicode.txt).
3. Run: `pyftsubset font_name.ttf --unicodes-file=sc_unicode.txt`.
4. Further compress using `Google woff2`.

</details>

---

### Tech Stack

- [Vue](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [IconPark](https://iconpark.oceanengine.com/official)
- [xicons](https://xicons.org/)
- [Aplayer](https://aplayer.js.org/)

### APIs Used

- [VVHAN WebAPI](https://api.vvhan.com/)
- [Btstu API](https://api.btstu.cn/doc/sjbz.php)
- [Oioweb API](https://api.oioweb.cn/doc/weather/GetWeather)
- [Amap LBS](https://lbs.amap.com/)
- [Hitokoto](https://hitokoto.cn/)
