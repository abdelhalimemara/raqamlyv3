import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
}

const CreateCampaign: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, category');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    }
  };

  const handleGenerateCampaign = async () => {
    setLoading(true);
    setError(null);

    try {
      const product = products.find(p => p.id === selectedProduct);
      if (!product) throw new Error('Selected product not found');

      const prompt = `I need a social media campaign caption. The product name is ${product.name}, and it falls under the category/categories of ${product.category}. Here's the product description: ${product.description}. Please write the caption in ${language} and make sure the tone is ${tone}. The caption should aim to achieve ${objective}, and the target audience is ${targetAudience}.`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      setGeneratedContent(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error generating campaign:', error);
      setError('Failed to generate campaign content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCampaign = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          product_id: selectedProduct,
          platform,
          language,
          objective,
          tone,
          target_audience: targetAudience,
          content: generatedContent,
        });

      if (error) throw error;
      navigate('/campaigns');
    } catch (error) {
      console.error('Error saving campaign:', error);
      setError('Failed to save campaign. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Create New Campaign</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">
            Select Product
          </label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platform">
            Social Media Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a platform</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
            Language
          </label>
          <input
            id="language"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter language"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="objective">
            Campaign Objective
          </label>
          <select
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an objective</option>
            <option value="Brand Awareness">Brand Awareness</option>
            <option value="Engagement">Engagement</option>
            <option value="Conversions">Conversions</option>
            <option value="Lead Generation">Lead Generation</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tone">
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a tone</option>
            <option value="Playful">Playful</option>
            <option value="Professional">Professional</option>
            <option value="Inspirational">Inspirational</option>
            <option value="Informative">Informative</option>
            <option value="Friendly">Friendly</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetAudience">
            Target Audience
          </label>
          <input
            id="targetAudience"
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter target audience"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleGenerateCampaign}
            disabled={loading || !selectedProduct || !platform || !language || !objective || !tone || !targetAudience}
            className="btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Campaign'}
          </button>
        </div>
      </div>
      {generatedContent && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
          <textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
          />
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleSaveCampaign}
              className="btn-primary"
            >
              Save Campaign
            </button>
            <button
              onClick={handleGenerateCampaign}
              className="btn-primary"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default CreateCampaign;