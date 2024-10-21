import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Campaign {
  id: string;
  product_id: string;
  platform: string;
  language: string;
  objective: string;
  content: string;
  created_at: string;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to fetch campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Campaigns</h1>
        <Link
          to="/create-campaign"
          className="bg-var(--primary-color) text-black px-6 py-2 rounded-full hover:bg-opacity-80 transition duration-300 font-semibold"
        >
          Create New Campaign
        </Link>
      </div>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && campaigns.length === 0 && (
        <p className="text-center text-gray-600 mt-8">
          No campaigns found. Start by creating a new campaign.
        </p>
      )}

      {!loading && !error && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{campaign.platform} Campaign</h2>
              <p className="text-gray-600 mb-4">Objective: {campaign.objective}</p>
              <p className="text-sm text-gray-500">Created on: {new Date(campaign.created_at).toLocaleDateString()}</p>
              <Link to={`/campaigns/${campaign.id}`} className="text-blue-600 hover:underline mt-4 inline-block">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;