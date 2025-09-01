const ExcelJS = require('exceljs');
const User = require('../models/User');

exports.generateUsersExcel = async (req, res) => {
  try {
    const users = await User.find({}).populate('products');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Username', key: 'username', width: 25 },
      { header: 'Products', key: 'products', width: 80 },
      { header: 'Addresses', key: 'address', width: 220 }
    ];

    users.forEach(user => {
      const productsString = (user.products || [])
        .map(p => (p && p.name) ? p.name : p ? p._id.toString() : '')
        .join(', ');

      const addressesString = (user.address || []).map(addr => {
        const parts = [];
        if (addr.saveAs) parts.push(`Save As: ${addr.saveAs}`);
        if (addr.houseNo) parts.push(`House No: ${addr.houseNo}`);
        if (addr.street) parts.push(`Street: ${addr.street}`);
        if (addr.city) parts.push(`City: ${addr.city}`);
        if (addr.country) parts.push(`Country: ${addr.country}`);
        if (addr.pincode) parts.push(`Pincode: ${addr.pincode}`);
        return parts.join(', ');
      }).join('\n');

      worksheet.addRow({
        username: user.username,
        products: productsString,
        address: addressesString
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=users.xlsx'
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    throw error;
  }
};