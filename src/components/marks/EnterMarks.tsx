import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { semesterSubjects } from '../../data/subjects';
import SubjectInput from './SubjectInput';

const EnterMarks: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Determine which semesters to show based on student ID prefix (year)
  const getSemestersToShow = () => {
    if (!user) return 0;
    
    const studentIdPrefix = user.id.substring(0, 2);
    
    if (studentIdPrefix === '28') return 2; // 1st year
    if (studentIdPrefix === '27') return 4; // 2nd year
    if (studentIdPrefix === '26') return 6; // 3rd year
    if (studentIdPrefix === '25') return 8; // 4th year
    
    return 0;
  };
  
  const semestersToShow = getSemestersToShow();

  useEffect(() => {
    loadMarks(selectedSemester);
  }, [selectedSemester]);

  const loadMarks = (semester: number) => {
    // Get the current user's marks from local storage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = storedUsers.find((u: any) => u.id === user?.id);
    
    if (currentUser) {
      const semesterMarks = currentUser[`semester${semester}`] || {};
      setMarks(semesterMarks);
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(Number(e.target.value));
  };

  const handleMarkChange = (key: string, value: number) => {
    setMarks(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    // In a real implementation, this would be an API call
    // For now, simulate with localStorage
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        storedUsers[userIndex][`semester${selectedSemester}`] = marks;
        localStorage.setItem('users', JSON.stringify(storedUsers));
        
        toast.success('Marks saved successfully!');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary mb-2 md:mb-0">Enter Semester Marks</h2>
          
          <div className="inline-flex items-center">
            <label htmlFor="semester" className="mr-2 text-sm font-medium">Select Semester:</label>
            <select
              id="semester"
              className="form-input py-2 w-40"
              value={selectedSemester}
              onChange={handleSemesterChange}
            >
              {Array.from({ length: semestersToShow }, (_, i) => (
                <option key={i} value={i + 1}>Semester {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
              Theory Subjects
            </h3>
            
            <div className="space-y-4">
              {semesterSubjects[selectedSemester]?.subjects.map((subject) => (
                <SubjectInput
                  key={subject}
                  label={subject}
                  name={subject.toLowerCase().replace(/\s+/g, '-')}
                  value={marks[subject.toLowerCase().replace(/\s+/g, '-')] ?? ''}
                  onChange={handleMarkChange}
                  max={typeof semesterSubjects[selectedSemester].maxMarks.subject === 'function'
                    ? semesterSubjects[selectedSemester].maxMarks.subject(subject)
                    : semesterSubjects[selectedSemester].maxMarks.subject
                  }
                />
              ))}
            </div>
          </div>
          
          {semesterSubjects[selectedSemester]?.labs && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
                Lab Subjects
              </h3>
              
              <div className="space-y-4">
                {semesterSubjects[selectedSemester].labs.map((lab) => (
                  <SubjectInput
                    key={lab}
                    label={lab}
                    name={lab.toLowerCase().replace(/\s+/g, '-')}
                    value={marks[lab.toLowerCase().replace(/\s+/g, '-')] ?? ''}
                    onChange={handleMarkChange}
                    max={semesterSubjects[selectedSemester].maxMarks.lab}
                    isLab={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Save Marks
                </>
              )}
            </button>
            
            <button
              type="button"
              className="btn border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterMarks;