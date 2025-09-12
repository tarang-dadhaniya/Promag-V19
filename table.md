# Table Structure Integration

## Overview

This document provides the structure and integration steps for embedding a dynamic table structure into this project. It guides you through creating a table, integrating it, and leveraging Builder.io's content management features to control and display dynamic data.

## Table Structure Example

The table will consist of the following columns:
- **ID**
- **Name**
- **Age**
- **Country**
- **Actions** (edit, delete)

### Example Table:

| ID  | Name      | Age | Country | Actions  |
|-----|-----------|-----|---------|----------|
| 1   | John Doe  | 30  | USA     | Edit | Delete |
| 2   | Jane Smith| 25  | Canada  | Edit | Delete |
| 3   | Robert Brown | 45  | UK  | Edit | Delete |

## Integration Steps

### 1. Create Table Structure in Builder.io

To integrate a table into your Builder.io project, you first need to create a basic table structure:

1. Go to the Builder.io dashboard and navigate to your project.
2. In your page or template, add a custom **HTML Block** or use the **Custom Code** feature.
3. Copy and paste the HTML code for the table as shown in the example above.

```html
<table id="dynamic-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>Country</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody id="table-body">
    <!-- Dynamic Rows will be inserted here -->
  </tbody>
</table>
```

### 2. Dynamic Data Integration

To fetch data dynamically and display it in the table, use Builder.io's API or external data sources like a REST API. You can configure Builder.io to pull this data into the table structure.

#### Example API integration:

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('table-body');
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.country}</td>
        <td><button onclick="editRow(${item.id})">Edit</button> <button onclick="deleteRow(${item.id})">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  });
```

### 3. Edit and Delete Actions

To manage the edit and delete actions for the table rows, you need to implement functions that handle these actions. These can be linked to your data API or a database.

#### Example Edit Function:

```javascript
function editRow(id) {
  // Logic for editing a row, e.g., show a form to update the record.
  console.log(`Edit record with ID: ${id}`);
}
```

#### Example Delete Function:

```javascript
function deleteRow(id) {
  // Logic for deleting a row, e.g., make an API call to delete the record.
  console.log(`Delete record with ID: ${id}`);
}
```

### 4. Language Support (Optional)

If you want your table to support multiple languages (e.g., French, Spanish, German), you can use Builder.io’s I18N integration. Add translations for the table headings, buttons, and any dynamic content that is language-dependent.

```javascript
const translations = {
  en: {
    name: 'Name',
    age: 'Age',
    country: 'Country',
    actions: 'Actions'
  },
  fr: {
    name: 'Nom',
    age: 'Âge',
    country: 'Pays',
    actions: 'Actions'
  },
  // Add other languages as needed
};

// Update table headings based on selected language
const currentLanguage = 'fr';  // Example: dynamic based on user selection

document.querySelector('th:nth-child(2)').textContent = translations[currentLanguage].name;
document.querySelector('th:nth-child(3)').textContent = translations[currentLanguage].age;
document.querySelector('th:nth-child(4)').textContent = translations[currentLanguage].country;
document.querySelector('th:nth-child(5)').textContent = translations[currentLanguage].actions;
```

### 5. Styling

To customize the table's appearance, you can use CSS or Builder.io’s design options. Here's an example of how you might style the table:

```css
#dynamic-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

#dynamic-table th, #dynamic-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

#dynamic-table th {
  background-color: #f4f4f4;
}

button {
  padding: 5px 10px;
  margin: 2px;
  cursor: pointer;
}
```

## Conclusion

This document outlines the basic steps for integrating a dynamic table structure into your Builder.io project. The table can be populated with data from an API and features editable and deletable rows. Additional customization options like language support and styling are also included to enhance the table’s functionality and appearance.
