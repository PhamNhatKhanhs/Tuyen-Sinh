const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tuyensinh_dh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
    checkStatuses();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Schema Application
const applicationSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidateProfileSnapshot: { type: Object, required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
    major: { type: mongoose.Schema.Types.ObjectId, ref: 'Major', required: true },
    admissionMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionMethod', required: true },
    subjectGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectGroup' },
    year: { type: Number, required: true, default: () => new Date().getFullYear() },
    submissionDate: { type: Date, default: Date.now },
    status: { 
        type: String,
        enum: ['pending', 'processing', 'additional_required', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    examScores: { type: Map, of: Number },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentProof' }],
    adminNotes: { type: String },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

async function checkStatuses() {
    try {
        console.log('Checking Application statuses in database...');
        
        const totalApplications = await Application.countDocuments({});
        console.log('Total applications:', totalApplications);
        
        if (totalApplications === 0) {
            console.log('No applications found in database!');
            process.exit(0);
        }
        
        // Count by status
        const statusCounts = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        console.log('Status counts:', statusCounts);
        
        // Get some sample data
        const samples = await Application.find({})
            .limit(5)
            .select('status candidate submissionDate year')
            .populate('candidate', 'fullName email');
        
        console.log('Sample applications:');
        samples.forEach((app, index) => {
            console.log(`${index + 1}. Status: ${app.status}, Year: ${app.year}, Candidate: ${app.candidate?.fullName || 'N/A'}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
