import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [monkeys, setMonkeys] = useState([]);
  const [newSighting, setNewSighting] = useState({ name: '', species: '', sightingNotes: '', sightingDate: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMonkeys = async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Monkey').find({
        include: ['owner'],
        sort: { createdAt: 'desc' }
      });
      setMonkeys(response.data);
    } catch (error) {
      console.error('Failed to load monkeys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMonkeys();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSighting({ ...newSighting, [name]: value });
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleCreateSighting = async (e) => {
    e.preventDefault();
    let photoData = null;
    if (photoFile) {
      photoData = await manifest.files.upload(photoFile);
    }

    try {
      const createdMonkey = await manifest.from('Monkey').create({ 
        ...newSighting,
        photo: photoData
      });
      // Prepend owner data manually for immediate UI update
      const monkeyWithOwner = { ...createdMonkey, owner: user };
      setMonkeys([monkeyWithOwner, ...monkeys]);
      setNewSighting({ name: '', species: '', sightingNotes: '', sightingDate: '' });
      setPhotoFile(null);
      e.target.reset(); // Reset file input
    } catch (error) {
      console.error('Failed to create sighting:', error);
      alert('Could not create sighting. Please check your input.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MonkeyLog Dashboard</h1>
            <p className="text-gray-600">Welcome, <span className='font-semibold'>{user.name}</span> ({user.role})!</p>
          </div>
          <div className="space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
              Admin Panel
            </a>
            <button 
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Log a New Sighting</h2>
              <form onSubmit={handleCreateSighting} className="space-y-4">
                <input type="text" name="name" placeholder="Monkey's Name (e.g., Koko)" value={newSighting.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                <input type="text" name="species" placeholder="Species (e.g., Howler)" value={newSighting.species} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                <textarea name="sightingNotes" placeholder="Sighting Notes..." value={newSighting.sightingNotes} onChange={handleInputChange} className="w-full p-2 border rounded-md" rows="3"></textarea>
                <input type="date" name="sightingDate" value={newSighting.sightingDate} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Photo</label>
                  <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Add Sighting</button>
              </form>
            </div>
          </div>
          
          <div className='lg:col-span-2'>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Sightings</h2>
              {isLoading ? (
                <p className='text-gray-500'>Loading sightings...</p>
              ) : monkeys.length === 0 ? (
                <p className="text-gray-500">No sightings yet. Be the first to log one!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {monkeys.map(monkey => (
                    <div key={monkey.id} className="border rounded-lg overflow-hidden shadow-sm bg-gray-50">
                      {monkey.photo?.thumbnail?.url ? (
                        <img src={monkey.photo.thumbnail.url} alt={monkey.name} className='w-full h-48 object-cover'/>
                      ) : (
                        <div className='w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400'>No Photo</div>
                      )}
                      <div className='p-4'>
                        <h3 className="font-bold text-lg text-gray-900">{monkey.name}</h3>
                        <p className="text-indigo-600 font-semibold text-sm">{monkey.species}</p>
                        <p className="text-gray-600 text-sm my-2 h-10 overflow-hidden">{monkey.sightingNotes}</p>
                        <p className="text-xs text-gray-500">Spotted on {new Date(monkey.sightingDate).toLocaleDateString()} by {monkey.owner?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
