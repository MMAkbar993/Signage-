import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { templates } from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for images

// Get all templates (Built-in + Custom)
app.get('/api/templates', (req, res) => {
    const customPath = path.join(__dirname, 'custom_templates.json');
    let customTemplates = [];
    
    if (fs.existsSync(customPath)) {
        try {
            const data = fs.readFileSync(customPath, 'utf8');
            customTemplates = JSON.parse(data);
        } catch (err) {
            console.error("Error reading custom templates:", err);
        }
    }
    
    res.json([...templates, ...customTemplates]);
});

// Save new template
app.post('/api/templates', (req, res) => {
    const newTemplate = req.body;
    const customPath = path.join(__dirname, 'custom_templates.json');
    let customTemplates = [];

    if (fs.existsSync(customPath)) {
        try {
            const data = fs.readFileSync(customPath, 'utf8');
            customTemplates = JSON.parse(data);
        } catch (err) {
            console.error("Error reading custom templates:", err);
        }
    }

    // Assign a unique ID
    newTemplate.id = `custom-${Date.now()}`;
    if (!newTemplate.category) {
        newTemplate.category = 'My Saved Designs';
    }
    
    customTemplates.push(newTemplate);

    fs.writeFileSync(customPath, JSON.stringify(customTemplates, null, 2));
    res.json(newTemplate);
});

// Delete template
app.delete('/api/templates/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Received delete request for ID: ${id}`);
    
    const customPath = path.join(__dirname, 'custom_templates.json');
    let customTemplates = [];

    if (fs.existsSync(customPath)) {
        try {
            const data = fs.readFileSync(customPath, 'utf8');
            customTemplates = JSON.parse(data);
        } catch (err) {
            console.error("Error reading custom templates:", err);
            return res.status(500).json({ error: 'Failed to read templates' });
        }
    }

    const initialLength = customTemplates.length;
    customTemplates = customTemplates.filter(t => String(t.id) !== String(id)); // Ensure type match

    console.log(`Initial length: ${initialLength}, New length: ${customTemplates.length}`);

    if (customTemplates.length === initialLength) {
        console.log('Template not found');
        return res.status(404).json({ error: 'Template not found' });
    }

    try {
        fs.writeFileSync(customPath, JSON.stringify(customTemplates, null, 2));
        console.log('Template deleted and file updated');
        res.json({ message: 'Template deleted successfully' });
    } catch (err) {
        console.error("Error writing custom templates:", err);
        res.status(500).json({ error: 'Failed to save changes' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
