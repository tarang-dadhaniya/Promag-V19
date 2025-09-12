
# Static Table Structure Integration
## Overview

This document provides the structure and integration steps for embedding a static table structure into your Builder.io project. It guides you through creating a basic table that doesn't rely on dynamic data.

## Table Structure Example

The table will consist of the following columns:
- **ID**
- **Name**
- **Age**
- **Country**
- **Actions** (edit, delete)

### Example Static Table:

| ID  | Name      | Age | Country | Actions  |
|-----|-----------|-----|---------|----------|
| 1   | John Doe  | 30  | USA     | Edit | Delete |
| 2   | Jane Smith| 25  | Canada  | Edit | Delete |
| 3   | Robert Brown | 45  | UK  | Edit | Delete |

## Integration Steps

### 1. Create Table Structure in Builder.io

To integrate a static table into your Builder.io project, you first need to create a basic table structure:

1. Go to the Builder.io dashboard and navigate to your project.
2. In your page or template, add a custom **HTML Block** or use the **Custom Code** feature.
3. Copy and paste the HTML code for the table as shown in the example above.

```html
<table id="static-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>Country</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>John Doe</td>
      <td>30</td>
      <td>USA</td>
      <td>Edit | Delete</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jane Smith</td>
      <td>25</td>
      <td>Canada</td>
      <td>Edit | Delete</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Robert Brown</td>
      <td>45</td>
      <td>UK</td>
      <td>Edit | Delete</td>
    </tr>
  </tbody>
</table>
```

### 2. Styling the Static Table

To customize the table's appearance, you can use CSS or Builder.io’s design options. Here's an example of how you might style the table:

```css
#static-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

#static-table th, #static-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

#static-table th {
  background-color: #f4f4f4;
}

button {
  padding: 5px 10px;
  margin: 2px;
  cursor: pointer;
}
```

## Conclusion

This document outlines the basic steps for integrating a static table structure into your Builder.io project. The table includes basic columns for displaying static data like ID, Name, Age, and Country. You can customize the appearance with CSS and manage table structure directly within Builder.io.
