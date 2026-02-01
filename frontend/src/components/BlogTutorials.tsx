import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MessageCircle,
  FileText,
  Download,
  Upload,
  Heart,
  Share2,
  Clock,
  User,
  Tag,
  Eye,
  Send,
  Paperclip,
  X,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Star,
  Users,
} from 'lucide-react';
import { getCurrentUser, logActivity } from '../utils/userTracking';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: 'safety-tips' | 'ehs' | 'construction' | 'fire-safety' | 'training' | 'regulations' | 'case-study' | 'general';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  comments: Comment[];
  documents: Document[];
  featured?: boolean;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  requesterId: string;
  category: string;
  createdAt: string;
  responses: DocumentResponse[];
  status: 'open' | 'fulfilled' | 'closed';
}

interface DocumentResponse {
  id: string;
  requestId: string;
  respondent: string;
  respondentId: string;
  message: string;
  documentName: string;
  documentUrl: string;
  createdAt: string;
}

export function BlogTutorials() {
  const [activeTab, setActiveTab] = useState<'posts' | 'documents' | 'create'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // New Post Form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as BlogPost['category'],
    tags: '',
  });

  // New Comment
  const [newComment, setNewComment] = useState('');

  // New Document Request
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'safety-tips',
  });

  useEffect(() => {
    loadPosts();
    loadDocumentRequests();
  }, []);

  const loadPosts = () => {
    const stored = localStorage.getItem('blogPosts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      // Initialize with sample posts
      const samplePosts: BlogPost[] = [
        {
          id: 'post_1',
          title: 'Top 10 Safety Practices for Construction Sites',
          content: `Construction sites are inherently dangerous environments. Here are the top 10 safety practices every worker should follow:

1. Always wear appropriate PPE (Personal Protective Equipment)
2. Conduct daily safety briefings
3. Maintain clean and organized work areas
4. Inspect tools and equipment before use
5. Follow lockout/tagout procedures
6. Use fall protection systems when working at heights
7. Ensure proper scaffolding installation and inspection
8. Maintain clear communication with team members
9. Report all hazards immediately
10. Never take shortcuts with safety procedures

Remember: Safety is everyone's responsibility!`,
          author: 'Safety Admin',
          authorId: 'admin_1',
          category: 'construction',
          tags: ['construction', 'safety', 'ppe', 'best-practices'],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          likes: 45,
          views: 230,
          comments: [
            {
              id: 'comment_1',
              postId: 'post_1',
              author: 'John Safety',
              authorId: 'user_1',
              content: 'Great list! We implemented these at our site and saw a 40% reduction in incidents.',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              likes: 12,
            }
          ],
          documents: [],
          featured: true,
        },
        {
          id: 'post_2',
          title: 'Fire Safety Procedures: Emergency Response Guide',
          content: `In case of fire, every second counts. Here's a comprehensive emergency response guide:

**Immediate Actions:**
- Activate the fire alarm
- Call emergency services (911)
- Evacuate using designated routes
- Never use elevators

**Prevention:**
- Regular fire drills
- Maintain fire extinguishers
- Keep exits clear
- Store flammable materials properly

**Training:**
All employees should receive fire safety training annually.`,
          author: 'Fire Safety Expert',
          authorId: 'expert_1',
          category: 'fire-safety',
          tags: ['fire-safety', 'emergency', 'evacuation', 'training'],
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          likes: 67,
          views: 412,
          comments: [],
          documents: [
            {
              id: 'doc_1',
              name: 'Fire_Safety_Checklist.pdf',
              type: 'PDF',
              url: '#',
              uploadedBy: 'Fire Safety Expert',
              uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
              downloads: 89,
            }
          ],
        }
      ];
      localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
      setPosts(samplePosts);
    }
  };

  const loadDocumentRequests = () => {
    const stored = localStorage.getItem('documentRequests');
    if (stored) {
      setDocumentRequests(JSON.parse(stored));
    } else {
      const sampleRequests: DocumentRequest[] = [
        {
          id: 'req_1',
          title: 'Looking for OSHA Confined Space Entry Checklist',
          description: 'Need a comprehensive checklist for confined space entry procedures that meets OSHA standards. Anyone have one they can share?',
          requester: 'Safety Manager',
          requesterId: 'user_2',
          category: 'regulations',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          responses: [
            {
              id: 'res_1',
              requestId: 'req_1',
              respondent: 'EHS Professional',
              respondentId: 'user_3',
              message: 'I have a great template we use. It covers all OSHA requirements.',
              documentName: 'OSHA_Confined_Space_Checklist.pdf',
              documentUrl: '#',
              createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            }
          ],
          status: 'fulfilled',
        }
      ];
      localStorage.setItem('documentRequests', JSON.stringify(sampleRequests));
      setDocumentRequests(sampleRequests);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      showMessage('error', 'Please fill in title and content!');
      return;
    }

    const currentUser = getCurrentUser();
    const post: BlogPost = {
      id: 'post_' + Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: currentUser.name,
      authorId: currentUser.id,
      category: newPost.category,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      comments: [],
      documents: [],
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

    logActivity('Blog Post Created', `Created post: ${post.title}`, 'user');
    
    setNewPost({ title: '', content: '', category: 'general', tags: '' });
    setShowCreatePost(false);
    showMessage('success', 'Post created successfully!');
  };

  const handleLikePost = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const currentUser = getCurrentUser();
    const comment: Comment = {
      id: 'comment_' + Date.now(),
      postId,
      author: currentUser.name,
      authorId: currentUser.id,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setNewComment('');
    showMessage('success', 'Comment added!');
  };

  const handleCreateDocumentRequest = () => {
    if (!newRequest.title || !newRequest.description) {
      showMessage('error', 'Please fill in all fields!');
      return;
    }

    const currentUser = getCurrentUser();
    const request: DocumentRequest = {
      id: 'req_' + Date.now(),
      title: newRequest.title,
      description: newRequest.description,
      requester: currentUser.name,
      requesterId: currentUser.id,
      category: newRequest.category,
      createdAt: new Date().toISOString(),
      responses: [],
      status: 'open',
    };

    const updatedRequests = [request, ...documentRequests];
    setDocumentRequests(updatedRequests);
    localStorage.setItem('documentRequests', JSON.stringify(updatedRequests));

    logActivity('Document Request Created', `Requested: ${request.title}`, 'user');
    
    setNewRequest({ title: '', description: '', category: 'safety-tips' });
    setShowCreateRequest(false);
    showMessage('success', 'Document request created!');
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'safety-tips', name: 'Safety Tips', icon: AlertCircle },
    { id: 'ehs', name: 'EHS', icon: Shield },
    { id: 'construction', name: 'Construction', icon: HardHat },
    { id: 'fire-safety', name: 'Fire Safety', icon: Flame },
    { id: 'training', name: 'Training', icon: GraduationCap },
    { id: 'regulations', name: 'Regulations', icon: FileText },
    { id: 'case-study', name: 'Case Studies', icon: TrendingUp },
    { id: 'general', name: 'General', icon: MessageCircle },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredRequests = documentRequests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      {/* Message Toast */}
      {saveMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in ${
          saveMessage.type === 'success' ? 'bg-green-600 text-white' :
          saveMessage.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        }`}>
          {saveMessage.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {saveMessage.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {saveMessage.type === 'info' && <AlertCircle className="w-5 h-5" />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl flex items-center gap-3 mb-2">
                <BookOpen className="w-10 h-10" />
                Safety Blog & Community
              </h1>
              <p className="text-blue-100">
                Share knowledge, request documents, and learn from the safety community
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreatePost(true)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg flex items-center gap-2 transition-colors border border-white/30"
              >
                <Plus className="w-5 h-5" />
                New Post
              </button>
              <button
                onClick={() => setShowCreateRequest(true)}
                className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Request Document
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-3 rounded-lg transition-all ${
                activeTab === 'posts'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Posts ({posts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-6 py-3 rounded-lg transition-all ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Document Requests ({documentRequests.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, documents, tags..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {activeTab === 'posts' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                {post.featured && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm mb-4">
                    <Star className="w-4 h-4" />
                    Featured Post
                  </div>
                )}
                
                <h2 className="text-2xl text-slate-900 mb-3">{post.title}</h2>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {post.views} views
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {post.category.replace('-', ' ').toUpperCase()}
                  </span>
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-700 mb-4 whitespace-pre-wrap line-clamp-3">{post.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments.length}</span>
                    </button>
                    {post.documents.length > 0 && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Paperclip className="w-5 h-5" />
                        <span>{post.documents.length} {post.documents.length === 1 ? 'document' : 'documents'}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No posts found</h3>
                <p className="text-slate-600">Try adjusting your search or create a new post!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl text-slate-900 mb-2">{request.title}</h3>
                    <p className="text-slate-600 mb-3">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {request.requester}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    request.status === 'open' ? 'bg-green-100 text-green-700' :
                    request.status === 'fulfilled' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>

                {request.responses.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-200">
                    <div className="text-sm text-slate-600 mb-2">Responses ({request.responses.length}):</div>
                    {request.responses.map(response => (
                      <div key={response.id} className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm text-slate-900">{response.respondent}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{response.message}</p>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Download className="w-4 h-4" />
                          <span>{response.documentName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No document requests</h3>
                <p className="text-slate-600">Be the first to request a document!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl text-slate-900">Create New Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value as BlogPost['category'] })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="safety-tips">Safety Tips</option>
                  <option value="ehs">EHS</option>
                  <option value="construction">Construction</option>
                  <option value="fire-safety">Fire Safety</option>
                  <option value="training">Training</option>
                  <option value="regulations">Regulations</option>
                  <option value="case-study">Case Study</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={10}
                  placeholder="Write your post content..."
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="safety, ppe, training..."
                />
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Document Request Modal */}
      {showCreateRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl text-slate-900">Request Document</h3>
              <button
                onClick={() => setShowCreateRequest(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">What document do you need?</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., OSHA Safety Checklist, Fire Drill Template..."
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Provide details about what you're looking for..."
                />
              </div>

              <button
                onClick={handleCreateDocumentRequest}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-2xl text-slate-900">{selectedPost.title}</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {selectedPost.documents.length > 0 && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-900 mb-3 flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Attached Documents
                  </h4>
                  <div className="space-y-2">
                    {selectedPost.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-slate-900">{doc.name}</div>
                            <div className="text-xs text-slate-500">{doc.downloads} downloads</div>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-slate-900 mb-4">Comments ({selectedPost.comments.length})</h4>
                
                <div className="space-y-4 mb-4">
                  {selectedPost.comments.map(comment => (
                    <div key={comment.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-slate-900">{comment.author}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-slate-700">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(selectedPost.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// Placeholder icons (using from lucide-react)
const Shield = AlertCircle;
const HardHat = Users;
const Flame = AlertCircle;
const GraduationCap = BookOpen;
