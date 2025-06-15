
# 📊 StatsBrew

**StatsBrew** is a modern web-based CSV analysis tool built with React and TypeScript. It allows users to upload CSV files and instantly view detailed statistical summaries, insightful visualizations, and a correlation heatmap—without writing any code.

---

## ✨ Features

- 📁 **CSV File Upload** with drag-and-drop or file picker
- 🧠 **Automatic Data Type Detection** (Numerical, Categorical, Date/Time)
- 📊 **Statistical Summaries** for each column:
  - Numerical: mean, median, mode, std deviation, range, quartiles, skewness, kurtosis
  - Categorical: unique count, top values, entropy
  - Date/Time: min/max, range, frequency by day/week/month
- 📈 **Data Visualizations** using [Recharts](https://recharts.org/):
  - Histograms and box plots for numerical data
  - Pie and bar charts for categorical data
  - Line/bar charts for datetime trends
- 🔗 **Correlation Matrix** with heatmap and key relationship insights
- 🧩 **Column Selector** and stat toggle to customize views
- 📤 **Export to PDF and CSV** for easy sharing of insights
- ⚡ Beautiful UI built with **Tailwind CSS**

---

## 📸 Preview

> _Screenshot placeholder_  
> You can upload an image or GIF of the dashboard for visual impact.

---

## 📁 Sample CSV Format

```csv
Name, Age, SignupDate, Gender
Alice, 28, 2021-01-15, Female
Bob, 34, 2021-03-10, Male
Charlie, 22, 2020-12-05, Non-binary
```

---

## 💻 Tech Stack

- **React + TypeScript** – UI and logic
- **Vite** – Build and dev server
- **Tailwind CSS** – Styling
- **PapaParse** – CSV parsing
- **Recharts** – Interactive data visualizations
- **jsPDF** – PDF generation for exports
- **Lucide Icons** – Iconography

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/saikiranterala/StatsBrew.git
cd StatsBrew
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🗂️ Project Structure

```
src/
├── components/         # UI components (StatsCard, FileUpload, Sidebar, etc.)
├── utils/              # Data processing logic (type detection, stats, correlation)
├── types/              # TypeScript interfaces for data models
├── App.tsx             # Main application container
├── main.tsx            # App entry point
├── index.html          # HTML template
```

---

## 📤 Export Options

Users can export analysis results in:

- 📄 **PDF** (detailed summary of each column)
- 📊 **CSV** (flat statistical summary)

---

## 🧪 Testing

Tests are not currently included. Suggested coverage:

- Data validation
- Statistical computation (unit tests)
- Component rendering (React Testing Library)

---

## 📜 License

MIT License (Add a `LICENSE` file to officially declare this)

---

## 🙌 Acknowledgements

Built with ❤️ by [saikiranterala](https://github.com/saikiranterala)  
Special thanks to open-source tools like [Recharts](https://recharts.org/) and [PapaParse](https://www.papaparse.com/)
