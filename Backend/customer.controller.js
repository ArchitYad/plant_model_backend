const User = require('./user.model'); 

exports.getAllCustomers = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const customers = await User.find({ role: 'customer' }); 
    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
};


exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== customer._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customer data', error: err.message });
  }
};

exports.addCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { username, email, password, role, plan } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const newCustomer = new User({ username, email, password, role, plan });
    await newCustomer.save();

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding customer', error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { username, email, password, role, plan } = req.body;

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const updatedCustomer = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password, role, plan },
      { new: true } 
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating customer data', error: err.message });
  }
};


exports.deleteCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const deletedCustomer = await User.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting customer', error: err.message });
  }
};