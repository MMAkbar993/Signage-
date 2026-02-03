import React from 'react';
import { useState, useEffect, useRef } from 'react';
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
  Briefcase,
  Bell,
  BellOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  UserPlus,
  Settings,
  MoreVertical,
  AtSign,
  Hash,
  Lock,
  Globe,
  ChevronDown,
  ChevronRight,
  Image,
  File,
  Trash2,
  Edit,
  Reply,
  Check,
  XCircle,
} from 'lucide-react';
import { getCurrentUser, logActivity } from '../utils/userTracking';

// =============== INTERFACES ===============

interface PostMedia {
  type: 'image' | 'video';
  url: string;
  name?: string;
}

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
  media?: PostMedia[];
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
  size?: string;
  uploadedBy: string;
  uploadedById?: string;
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
  mentionedUsers: string[]; // User IDs who were mentioned
}

// Jobs Interfaces
interface JobComment {
  id: string;
  jobId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  description: string;
  requirements: string[];
  salary?: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'filled' | 'closed';
  applicants: JobApplicant[];
  comments: JobComment[];
  views: number;
  category: string;
}

interface JobApplicant {
  id: string;
  userId: string;
  userName: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  message: string;
  resumeUrl?: string;
  resumeName?: string;
}

// Chat Interfaces
interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'document' | 'image' | 'system';
  mentions: string[]; // User IDs mentioned in message
  attachments: ChatAttachment[];
  createdAt: string;
  readBy: string[];
  replyTo?: string; // Message ID being replied to
}

interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
}

interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string; // For group chats
  participants: string[]; // User IDs
  participantNames: { [key: string]: string };
  createdBy: string;
  createdAt: string;
  lastMessage?: ChatMessage;
  unreadCount: { [key: string]: number };
  admins?: string[]; // For group chats
}

interface VoiceCall {
  id: string;
  chatId: string;
  initiatorId: string;
  initiatorName: string;
  participants: string[];
  status: 'ringing' | 'ongoing' | 'ended' | 'missed';
  startedAt: string;
  endedAt?: string;
}

// Friend Request Interface
interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

// Notification Interface
interface Notification {
  id: string;
  userId: string;
  type: 'job_status' | 'mention' | 'message' | 'document_response' | 'job_application' | 'voice_call' | 'group_invite' | 'friend_request';
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: string;
}

// =============== MAIN COMPONENT ===============

export function BlogTutorials() {
  // Main tabs
  const [activeTab, setActiveTab] = useState<'posts' | 'documents' | 'jobs' | 'chat'>('posts');
  
  // Posts state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Jobs state
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [jobFilter, setJobFilter] = useState<'all' | 'open' | 'filled' | 'closed' | 'my-jobs'>('all');
  const [newJobComment, setNewJobComment] = useState('');

  // Chat state
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<{ [chatId: string]: ChatMessage[] }>({});
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  
  // Chat menu (3-dots) and mute
  const [showChatMenuDropdown, setShowChatMenuDropdown] = useState(false);
  const [mutedChatIds, setMutedChatIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('mutedChatIds');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  const chatMenuRef = useRef<HTMLDivElement>(null);

  // Voice call state
  const [activeCall, setActiveCall] = useState<VoiceCall | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Friends & requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    try {
      const s = localStorage.getItem('friendRequests');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // New Post Form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as BlogPost['category'],
    tags: '',
  });
  const [newPostMedia, setNewPostMedia] = useState<{ file: File; previewUrl: string }[]>([]);
  const newPostMediaInputRef = useRef<HTMLInputElement>(null);

  // New Comment
  const [newComment, setNewComment] = useState('');

  // New Document Request
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'safety-tips',
  });

  // New Job Form
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time' as JobPost['type'],
    description: '',
    requirements: '',
    salary: '',
    category: 'safety',
  });

  // New Group Form
  const [newGroup, setNewGroup] = useState({
    name: '',
    selectedMembers: [] as string[],
  });

  // Document upload state
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentResponseData, setDocumentResponseData] = useState({
    message: '',
    mentionedUsers: [] as string[],
    selectedFile: null as File | null,
  });
  const [showDocumentResponse, setShowDocumentResponse] = useState<string | null>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Job application resume
  const [jobApplicationResume, setJobApplicationResume] = useState<File | null>(null);
  const jobApplicationResumeInputRef = useRef<HTMLInputElement>(null);

  // =============== EFFECTS ===============

  useEffect(() => {
    loadPosts();
    loadDocumentRequests();
    loadJobs();
    loadChats();
    loadNotifications();
    loadChatUsers();
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadNotificationCount(unread);
  }, [notifications]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, selectedChat]);

  useEffect(() => {
    localStorage.setItem('mutedChatIds', JSON.stringify(mutedChatIds));
  }, [mutedChatIds]);

  useEffect(() => {
    localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target as Node)) {
        setShowChatMenuDropdown(false);
      }
    };
    if (showChatMenuDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showChatMenuDropdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // =============== LOADERS ===============

  const loadPosts = () => {
    const stored = localStorage.getItem('blogPosts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
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
              message: '@Safety Manager I have a great template we use. It covers all OSHA requirements.',
              documentName: 'OSHA_Confined_Space_Checklist.pdf',
              documentUrl: '#',
              createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
              mentionedUsers: ['user_2'],
            }
          ],
          status: 'fulfilled',
        }
      ];
      localStorage.setItem('documentRequests', JSON.stringify(sampleRequests));
      setDocumentRequests(sampleRequests);
    }
  };

  const loadJobs = () => {
    const stored = localStorage.getItem('jobPosts');
    if (stored) {
      const parsed = JSON.parse(stored) as JobPost[];
      setJobs(parsed.map(j => ({ ...j, comments: j.comments ?? [] })));
    } else {
      const sampleJobs: JobPost[] = [
        {
          id: 'job_1',
          title: 'Safety Manager',
          company: 'BuildSafe Construction',
          location: 'New York, NY',
          type: 'full-time',
          description: 'We are looking for an experienced Safety Manager to oversee all safety operations at our construction sites.',
          requirements: ['5+ years experience', 'OSHA certification', 'Strong leadership skills'],
          salary: '$80,000 - $100,000',
          author: 'HR Manager',
          authorId: 'hr_1',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'open',
          applicants: [],
          comments: [],
          views: 156,
          category: 'management',
        },
        {
          id: 'job_2',
          title: 'EHS Coordinator',
          company: 'SafetyFirst Inc.',
          location: 'Remote',
          type: 'remote',
          description: 'Join our team as an EHS Coordinator. You will be responsible for developing and implementing safety programs.',
          requirements: ['3+ years experience', 'Knowledge of OSHA regulations', 'Excellent communication skills'],
          salary: '$60,000 - $75,000',
          author: 'Hiring Manager',
          authorId: 'hire_1',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: 'open',
          applicants: [],
          comments: [],
          views: 234,
          category: 'coordinator',
        }
      ];
      localStorage.setItem('jobPosts', JSON.stringify(sampleJobs));
      setJobs(sampleJobs);
    }
  };

  const loadChats = () => {
    const stored = localStorage.getItem('chats');
    const storedMessages = localStorage.getItem('chatMessages');
    
    if (stored) {
      setChats(JSON.parse(stored));
    }
    if (storedMessages) {
      setChatMessages(JSON.parse(storedMessages));
    }
  };

  const loadNotifications = () => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  const loadChatUsers = () => {
    // Simulate loading users - in real app, this would come from backend
    const users: ChatUser[] = [
      { id: 'user_1', name: 'John Safety', status: 'online' },
      { id: 'user_2', name: 'Safety Manager', status: 'online' },
      { id: 'user_3', name: 'EHS Professional', status: 'away' },
      { id: 'admin_1', name: 'Safety Admin', status: 'online' },
      { id: 'expert_1', name: 'Fire Safety Expert', status: 'offline' },
      { id: 'hr_1', name: 'HR Manager', status: 'online' },
    ];
    setChatUsers(users);
  };

  // =============== HELPERS ===============

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: 'notif_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    return newNotification;
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const getCurrentUserId = () => {
    const user = getCurrentUser();
    return user.id;
  };

  const getCurrentUserName = () => {
    const user = getCurrentUser();
    return user.name;
  };

  // =============== POST HANDLERS ===============

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      showMessage('error', 'Please fill in title and content!');
      return;
    }

    const currentUser = getCurrentUser();
    const media: PostMedia[] = [];
    const maxDataUrlSize = 2 * 1024 * 1024; // 2MB for localStorage-friendly data URLs

    for (const { file, previewUrl } of newPostMedia) {
      const type = file.type.startsWith('image/') ? 'image' as const : 'video' as const;
      if (file.size <= maxDataUrlSize) {
        try {
          const url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          media.push({ type, url, name: file.name });
        } catch {
          media.push({ type, url: previewUrl, name: file.name });
        }
      } else {
        media.push({ type, url: previewUrl, name: file.name });
      }
    }

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
      media: media.length > 0 ? media : undefined,
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

    logActivity('Blog Post Created', `Created post: ${post.title}`, 'user');

    newPostMedia.forEach(({ previewUrl }) => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    });
    setNewPost({ title: '', content: '', category: 'general', tags: '' });
    setNewPostMedia([]);
    if (newPostMediaInputRef.current) newPostMediaInputRef.current.value = '';
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

  // =============== DOCUMENT REQUEST HANDLERS ===============

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

  const handleDocumentResponse = (requestId: string) => {
    if (!documentResponseData.message) {
      showMessage('error', 'Please add a message!');
      return;
    }
    if (!documentResponseData.selectedFile) {
      showMessage('error', 'Please select a document to upload.');
      return;
    }

    const currentUser = getCurrentUser();
    const file = documentResponseData.selectedFile;
    const response: DocumentResponse = {
      id: 'res_' + Date.now(),
      requestId,
      respondent: currentUser.name,
      respondentId: currentUser.id,
      message: documentResponseData.message,
      documentName: file.name,
      documentUrl: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
      mentionedUsers: documentResponseData.mentionedUsers,
    };

    const request = documentRequests.find(r => r.id === requestId);
    
    // Notify mentioned users
    documentResponseData.mentionedUsers.forEach(userId => {
      createNotification({
        userId,
        type: 'document_response',
        title: 'Document Shared With You',
        message: `${currentUser.name} mentioned you and shared a document for "${request?.title}"`,
        data: { requestId, responseId: response.id },
        read: false,
      });
    });

    // Notify the original requester if not already mentioned
    if (request && !documentResponseData.mentionedUsers.includes(request.requesterId)) {
      createNotification({
        userId: request.requesterId,
        type: 'document_response',
        title: 'Document Response',
        message: `${currentUser.name} responded to your document request "${request.title}"`,
        data: { requestId, responseId: response.id },
        read: false,
      });
    }

    const updatedRequests = documentRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          responses: [...req.responses, response],
          status: 'fulfilled' as const,
        };
      }
      return req;
    });

    setDocumentRequests(updatedRequests);
    // Persist with # for document URLs (blob URLs don't survive page reload)
    const toStore = updatedRequests.map(req => ({
      ...req,
      responses: req.responses.map(r => ({
        ...r,
        documentUrl: r.documentUrl.startsWith('blob:') ? '#' : r.documentUrl,
      })),
    }));
    localStorage.setItem('documentRequests', JSON.stringify(toStore));
    
    setDocumentResponseData({ message: '', mentionedUsers: [], selectedFile: null });
    setShowDocumentResponse(null);
    showMessage('success', 'Document shared successfully!');
  };

  // =============== JOB HANDLERS ===============

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.company || !newJob.description) {
      showMessage('error', 'Please fill in required fields!');
      return;
    }

    const currentUser = getCurrentUser();
    const job: JobPost = {
      id: 'job_' + Date.now(),
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      type: newJob.type,
      description: newJob.description,
      requirements: newJob.requirements.split('\n').filter(r => r.trim()),
      salary: newJob.salary,
      author: currentUser.name,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
      applicants: [],
      comments: [],
      views: 0,
      category: newJob.category,
    };

    const updatedJobs = [job, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('jobPosts', JSON.stringify(updatedJobs));

    logActivity('Job Posted', `Posted job: ${job.title}`, 'user');
    
    setNewJob({
      title: '',
      company: '',
      location: '',
      type: 'full-time',
      description: '',
      requirements: '',
      salary: '',
      category: 'safety',
    });
    setShowCreateJob(false);
    showMessage('success', 'Job posted successfully!');
  };

  const handleAddJobComment = (jobId: string) => {
    const content = newJobComment.trim();
    if (!content) return;

    const currentUser = getCurrentUser();
    const comment: JobComment = {
      id: 'jobcomment_' + Date.now(),
      jobId,
      author: currentUser.name,
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = jobs.map(j =>
      j.id === jobId
        ? { ...j, comments: [...(j.comments ?? []), comment] }
        : j
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobPosts', JSON.stringify(updatedJobs));
    setNewJobComment('');
    if (selectedJob?.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, comments: [...(prev.comments ?? []), comment] } : null);
    }
    showMessage('success', 'Comment added');
  };

  const handleUpdateJobStatus = (jobId: string, newStatus: JobPost['status']) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const updatedJobs = jobs.map(j => {
      if (j.id === jobId) {
        return { ...j, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return j;
    });

    setJobs(updatedJobs);
    localStorage.setItem('jobPosts', JSON.stringify(updatedJobs));

    // Notify the job poster about status change
    createNotification({
      userId: job.authorId,
      type: 'job_status',
      title: 'Job Status Updated',
      message: `Your job posting "${job.title}" has been marked as ${newStatus.toUpperCase()}. ${newStatus === 'filled' ? 'Congratulations on finding a candidate!' : ''}`,
      data: { jobId, status: newStatus },
      read: false,
    });

    showMessage('success', `Job marked as ${newStatus}!`);
  };

  const handleApplyForJob = async (jobId: string, message: string) => {
    const currentUser = getCurrentUser();
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    let resumeUrl: string | undefined;
    let resumeName: string | undefined;
    const maxDataUrlSize = 2 * 1024 * 1024; // 2MB for localStorage

    if (jobApplicationResume) {
      resumeName = jobApplicationResume.name;
      if (jobApplicationResume.size <= maxDataUrlSize) {
        try {
          resumeUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(jobApplicationResume!);
          });
        } catch {
          resumeUrl = URL.createObjectURL(jobApplicationResume);
        }
      } else {
        resumeUrl = URL.createObjectURL(jobApplicationResume);
      }
    }

    const applicant: JobApplicant = {
      id: 'app_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      appliedAt: new Date().toISOString(),
      status: 'pending',
      message,
      resumeUrl,
      resumeName,
    };

    const updatedJobs = jobs.map(j => {
      if (j.id === jobId) {
        return { ...j, applicants: [...j.applicants, applicant] };
      }
      return j;
    });

    setJobs(updatedJobs);
    const toStore = updatedJobs.map(j => ({
      ...j,
      applicants: j.applicants.map(a => ({
        ...a,
        resumeUrl: a.resumeUrl?.startsWith('blob:') ? '#' : a.resumeUrl,
      })),
    }));
    localStorage.setItem('jobPosts', JSON.stringify(toStore));

    setJobApplicationResume(null);
    if (jobApplicationResumeInputRef.current) jobApplicationResumeInputRef.current.value = '';
    setSelectedJob(null);

    createNotification({
      userId: job.authorId,
      type: 'job_application',
      title: 'New Job Application',
      message: `${currentUser.name} applied for your job posting "${job.title}"`,
      data: { jobId, applicantId: applicant.id },
      read: false,
    });

    showMessage('success', 'Application submitted!');
  };

  // =============== CHAT HANDLERS ===============

  const handleStartPrivateChat = (userId: string) => {
    const currentUser = getCurrentUser();
    const otherUser = chatUsers.find(u => u.id === userId);
    if (!otherUser) return;

    // Check if chat already exists
    const existingChat = chats.find(c => 
      c.type === 'private' && 
      c.participants.includes(currentUser.id) && 
      c.participants.includes(userId)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      setShowNewChat(false);
      return;
    }

    const chat: Chat = {
      id: 'chat_' + Date.now(),
      type: 'private',
      participants: [currentUser.id, userId],
      participantNames: {
        [currentUser.id]: currentUser.name,
        [userId]: otherUser.name,
      },
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      unreadCount: { [currentUser.id]: 0, [userId]: 0 },
    };

    const updatedChats = [chat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    
    setSelectedChat(chat);
    setShowNewChat(false);
  };

  const handleDeleteChat = (chatId: string) => {
    if (!confirm('Delete this conversation? Messages will be removed.')) return;
    const newChats = chats.filter(c => c.id !== chatId);
    const updatedMessages = { ...chatMessages };
    delete updatedMessages[chatId];
    setChats(newChats);
    setChatMessages(updatedMessages);
    setMutedChatIds(prev => prev.filter(id => id !== chatId));
    if (selectedChat?.id === chatId) setSelectedChat(null);
    localStorage.setItem('chats', JSON.stringify(newChats));
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setShowChatMenuDropdown(false);
    showMessage('success', 'Chat deleted');
  };

  const handleMuteChat = (chatId: string) => {
    setMutedChatIds(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
    setShowChatMenuDropdown(false);
    showMessage('info', mutedChatIds.includes(chatId) ? 'Chat unmuted' : 'Chat muted');
  };

  // Friends: list of user ids who are friends with current user (accepted request in both directions)
  const getFriends = (): string[] => {
    const currentId = getCurrentUser().id;
    const accepted = friendRequests.filter(r => r.status === 'accepted');
    const friendIds = new Set<string>();
    accepted.forEach(r => {
      if (r.fromUserId === currentId) friendIds.add(r.toUserId);
      if (r.toUserId === currentId) friendIds.add(r.fromUserId);
    });
    return Array.from(friendIds);
  };

  const handleSendFriendRequest = (toUserId: string) => {
    const currentUser = getCurrentUser();
    const toUser = chatUsers.find(u => u.id === toUserId);
    if (!toUser) return;
    const isAlreadyFriends = friendRequests.some(r =>
      r.status === 'accepted' &&
      ((r.fromUserId === currentUser.id && r.toUserId === toUserId) || (r.fromUserId === toUserId && r.toUserId === currentUser.id))
    );
    if (isAlreadyFriends) {
      showMessage('info', 'You are already friends');
      return;
    }
    if (friendRequests.some(r => r.fromUserId === currentUser.id && r.toUserId === toUserId && r.status === 'pending')) {
      showMessage('info', 'Request already sent');
      return;
    }
    if (friendRequests.some(r => r.fromUserId === toUserId && r.toUserId === currentUser.id && r.status === 'pending')) {
      showMessage('info', 'They sent you a request - check Pending to accept');
      return;
    }
    const request: FriendRequest = {
      id: 'fr_' + Date.now(),
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId,
      toUserName: toUser.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setFriendRequests(prev => [request, ...prev]);
    createNotification({
      userId: toUserId,
      type: 'friend_request',
      title: 'Friend Request',
      message: `${currentUser.name} sent you a friend request`,
      data: { requestId: request.id, fromUserId: currentUser.id },
      read: false,
    });
    showMessage('success', 'Friend request sent');
  };

  const handleAcceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return;
    setFriendRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'accepted' as const } : r)
    );
    createNotification({
      userId: request.fromUserId,
      type: 'friend_request',
      title: 'Friend Request Accepted',
      message: `${getCurrentUser().name} accepted your friend request`,
      data: { requestId, acceptedBy: getCurrentUser().id },
      read: false,
    });
    setShowFriendsModal(false);
    showMessage('success', `You are now friends with ${request.fromUserName}`);
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    setFriendRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'declined' as const } : r)
    );
    showMessage('info', 'Friend request declined');
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || newGroup.selectedMembers.length === 0) {
      showMessage('error', 'Please provide group name and select members!');
      return;
    }

    const currentUser = getCurrentUser();
    const allParticipants = [currentUser.id, ...newGroup.selectedMembers];
    
    const participantNames: { [key: string]: string } = {
      [currentUser.id]: currentUser.name,
    };
    newGroup.selectedMembers.forEach(id => {
      const user = chatUsers.find(u => u.id === id);
      if (user) {
        participantNames[id] = user.name;
      }
    });

    const chat: Chat = {
      id: 'chat_' + Date.now(),
      type: 'group',
      name: newGroup.name,
      participants: allParticipants,
      participantNames,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      unreadCount: Object.fromEntries(allParticipants.map(id => [id, 0])),
      admins: [currentUser.id],
    };

    const updatedChats = [chat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    // Notify group members
    newGroup.selectedMembers.forEach(userId => {
      createNotification({
        userId,
        type: 'group_invite',
        title: 'Added to Group',
        message: `${currentUser.name} added you to the group "${newGroup.name}"`,
        data: { chatId: chat.id },
        read: false,
      });
    });

    setNewGroup({ name: '', selectedMembers: [] });
    setSelectedChat(chat);
    setShowNewGroup(false);
    showMessage('success', 'Group created!');
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const currentUser = getCurrentUser();
    
    // Parse mentions from message
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(chatMessage)) !== null) {
      const mentionedUser = chatUsers.find(u => 
        u.name.toLowerCase().includes(match[1].toLowerCase())
      );
      if (mentionedUser) {
        mentions.push(mentionedUser.id);
      }
    }

    const message: ChatMessage = {
      id: 'msg_' + Date.now(),
      chatId: selectedChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: chatMessage,
      type: 'text',
      mentions,
      attachments: [],
      createdAt: new Date().toISOString(),
      readBy: [currentUser.id],
    };

    const updatedMessages = {
      ...chatMessages,
      [selectedChat.id]: [...(chatMessages[selectedChat.id] || []), message],
    };
    setChatMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    // Update chat's last message
    const updatedChats = chats.map(c => {
      if (c.id === selectedChat.id) {
        const newUnreadCount = { ...c.unreadCount };
        c.participants.forEach(p => {
          if (p !== currentUser.id) {
            newUnreadCount[p] = (newUnreadCount[p] || 0) + 1;
          }
        });
        return { ...c, lastMessage: message, unreadCount: newUnreadCount };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    // Notify mentioned users
    mentions.forEach(userId => {
      createNotification({
        userId,
        type: 'mention',
        title: selectedChat.type === 'group' ? `Mentioned in ${selectedChat.name}` : 'Mentioned in Chat',
        message: `${currentUser.name} mentioned you: "${chatMessage.substring(0, 50)}${chatMessage.length > 50 ? '...' : ''}"`,
        data: { chatId: selectedChat.id, messageId: message.id },
        read: false,
      });
    });

    // Notify other participants (if not already mentioned)
    selectedChat.participants.forEach(userId => {
      if (userId !== currentUser.id && !mentions.includes(userId)) {
        createNotification({
          userId,
          type: 'message',
          title: selectedChat.type === 'group' ? `New message in ${selectedChat.name}` : `Message from ${currentUser.name}`,
          message: `${currentUser.name}: ${chatMessage.substring(0, 50)}${chatMessage.length > 50 ? '...' : ''}`,
          data: { chatId: selectedChat.id, messageId: message.id },
          read: false,
        });
      }
    });

    setChatMessage('');
    setShowMentionDropdown(false);
  };

  const handleSendDocument = (file: File) => {
    if (!selectedChat) return;

    const currentUser = getCurrentUser();
    
    const attachment: ChatAttachment = {
      id: 'attach_' + Date.now(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
    };

    const message: ChatMessage = {
      id: 'msg_' + Date.now(),
      chatId: selectedChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `Shared a document: ${file.name}`,
      type: 'document',
      mentions: [],
      attachments: [attachment],
      createdAt: new Date().toISOString(),
      readBy: [currentUser.id],
    };

    const updatedMessages = {
      ...chatMessages,
      [selectedChat.id]: [...(chatMessages[selectedChat.id] || []), message],
    };
    setChatMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    showMessage('success', 'Document sent!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Voice call handlers
  const handleStartVoiceCall = () => {
    if (!selectedChat) return;

    const currentUser = getCurrentUser();
    const call: VoiceCall = {
      id: 'call_' + Date.now(),
      chatId: selectedChat.id,
      initiatorId: currentUser.id,
      initiatorName: currentUser.name,
      participants: [currentUser.id],
      status: 'ringing',
      startedAt: new Date().toISOString(),
    };

    setActiveCall(call);

    // Notify other participants
    selectedChat.participants.forEach(userId => {
      if (userId !== currentUser.id) {
        createNotification({
          userId,
          type: 'voice_call',
          title: 'Incoming Voice Call',
          message: `${currentUser.name} is calling...`,
          data: { callId: call.id, chatId: selectedChat.id },
          read: false,
        });
      }
    });

    // Simulate call being answered after 2 seconds
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'ongoing' } : null);
    }, 2000);
  };

  const handleEndCall = () => {
    if (activeCall) {
      setActiveCall({ ...activeCall, status: 'ended', endedAt: new Date().toISOString() });
      setTimeout(() => setActiveCall(null), 1000);
    }
  };

  // Handle mention input
  const handleChatInputChange = (value: string) => {
    setChatMessage(value);
    
    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentionDropdown(true);
      setMentionSearch('');
    } else if (lastAtIndex !== -1) {
      const textAfterAt = value.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setShowMentionDropdown(true);
        setMentionSearch(textAfterAt);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleSelectMention = (user: ChatUser) => {
    const lastAtIndex = chatMessage.lastIndexOf('@');
    const newMessage = chatMessage.substring(0, lastAtIndex) + `@${user.name} `;
    setChatMessage(newMessage);
    setShowMentionDropdown(false);
    chatInputRef.current?.focus();
  };

  // =============== FILTERS ===============

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

  const filteredJobs = jobs.filter(job => {
    const currentUser = getCurrentUser();
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (jobFilter === 'my-jobs') {
      return matchesSearch && job.authorId === currentUser.id;
    }
    if (jobFilter === 'all') {
      return matchesSearch;
    }
    return matchesSearch && job.status === jobFilter;
  });

  const filteredMentionUsers = chatUsers.filter(user => 
    user.name.toLowerCase().includes(mentionSearch.toLowerCase()) &&
    selectedChat?.participants.includes(user.id)
  );

  // =============== RENDER ===============

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      {/* Message Toast */}
      {saveMessage && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in ${
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

      {/* Active Call Overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-900/95 z-[90] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl text-white mb-2">
              {activeCall.status === 'ringing' ? 'Calling...' : 'Voice Call'}
            </h3>
            <p className="text-slate-400 mb-8">
              {activeCall.status === 'ongoing' ? 'Connected' : 'Waiting for answer...'}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full ${isMuted ? 'bg-red-600' : 'bg-slate-700'} text-white transition-colors`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={handleEndCall}
                className="p-4 rounded-full bg-red-600 text-white"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-full ${isVideoOn ? 'bg-blue-600' : 'bg-slate-700'} text-white transition-colors`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>
            </div>
          </div>
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
                Share knowledge, request documents, find jobs, and connect with the safety community
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-[500px] overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 20).map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                              !notif.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notif.type === 'mention' ? 'bg-purple-100 text-purple-600' :
                                notif.type === 'message' ? 'bg-blue-100 text-blue-600' :
                                notif.type === 'job_status' ? 'bg-green-100 text-green-600' :
                                notif.type === 'document_response' ? 'bg-orange-100 text-orange-600' :
                                notif.type === 'friend_request' ? 'bg-indigo-100 text-indigo-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {notif.type === 'mention' && <AtSign className="w-5 h-5" />}
                                {notif.type === 'message' && <MessageCircle className="w-5 h-5" />}
                                {notif.type === 'job_status' && <Briefcase className="w-5 h-5" />}
                                {notif.type === 'document_response' && <FileText className="w-5 h-5" />}
                                {notif.type === 'voice_call' && <Phone className="w-5 h-5" />}
                                {notif.type === 'group_invite' && <Users className="w-5 h-5" />}
                                {notif.type === 'job_application' && <User className="w-5 h-5" />}
                                {notif.type === 'friend_request' && <UserPlus className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">{notif.title}</p>
                                <p className="text-slate-600 text-sm truncate">{notif.message}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 min-w-[120px] px-6 py-3 rounded-lg transition-all ${
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
              className={`flex-1 min-w-[120px] px-6 py-3 rounded-lg transition-all ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Documents ({documentRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 min-w-[120px] px-6 py-3 rounded-lg transition-all ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span>Jobs ({jobs.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 min-w-[120px] px-6 py-3 rounded-lg transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
                {chats.some(c => Object.values(c.unreadCount).some(count => (count as number) > 0)) && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filter - Not for Chat */}
        {activeTab !== 'chat' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'posts' ? 'Search posts, documents, tags...' :
                    activeTab === 'jobs' ? 'Search jobs, companies...' :
                    'Search document requests...'
                  }
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
              {activeTab === 'jobs' && (
                <div className="flex gap-2">
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value as any)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Jobs</option>
                    <option value="open">Open Positions</option>
                    <option value="filled">Filled</option>
                    <option value="closed">Closed</option>
                    <option value="my-jobs">My Posted Jobs</option>
                  </select>
                  <button
                    onClick={() => setShowCreateJob(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Post Job
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =============== POSTS TAB =============== */}
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

                <div className="flex items-center gap-2 mb-4 flex-wrap">
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

                {post.media && post.media.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {post.media.slice(0, 3).map((m, i) => (
                      <div key={i} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-200">
                        {m.type === 'image' ? (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-300">
                            <Video className="w-6 h-6 text-slate-500" />
                          </div>
                        )}
                      </div>
                    ))}
                    {post.media.length > 3 && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-sm text-slate-600">
                        +{post.media.length - 3}
                      </div>
                    )}
                  </div>
                )}

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

        {/* =============== DOCUMENTS TAB =============== */}
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

                {/* Response Button */}
                {request.status === 'open' && (
                  <button
                    onClick={() => setShowDocumentResponse(request.id)}
                    className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Share Document
                  </button>
                )}

                {/* Document Response Form */}
                {showDocumentResponse === request.id && (
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-3">Share a Document</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">Message (use @ to mention users)</label>
                        <textarea
                          value={documentResponseData.message}
                          onChange={(e) => {
                            setDocumentResponseData({ ...documentResponseData, message: e.target.value });
                            // Parse mentions
                            const mentions = e.target.value.match(/@(\w+)/g) || [];
                            const mentionedIds = mentions.map(m => {
                              const name = m.substring(1);
                              const user = chatUsers.find(u => u.name.toLowerCase().includes(name.toLowerCase()));
                              return user?.id;
                            }).filter(Boolean) as string[];
                            setDocumentResponseData(prev => ({ ...prev, mentionedUsers: mentionedIds }));
                          }}
                          placeholder={`@${request.requester} Here's the document you requested...`}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          ref={documentFileInputRef}
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setDocumentResponseData(prev => ({ ...prev, selectedFile: file }));
                          }}
                        />
                        <label
                          onClick={() => documentFileInputRef.current?.click()}
                          className="flex-1 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center"
                        >
                          <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {documentResponseData.selectedFile
                              ? documentResponseData.selectedFile.name
                              : 'Upload Document'}
                          </span>
                        </label>
                        {documentResponseData.selectedFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setDocumentResponseData(prev => ({ ...prev, selectedFile: null }));
                              if (documentFileInputRef.current) documentFileInputRef.current.value = '';
                            }}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove file"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDocumentResponse(request.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          Share Document
                        </button>
                        <button
                          onClick={() => {
                            setShowDocumentResponse(null);
                            setDocumentResponseData(prev => ({ ...prev, selectedFile: null }));
                            if (documentFileInputRef.current) documentFileInputRef.current.value = '';
                          }}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                        <a
                          href={response.documentUrl}
                          download={response.documentName}
                          target={response.documentUrl.startsWith('blob:') ? undefined : '_blank'}
                          rel={response.documentUrl.startsWith('blob:') ? undefined : 'noopener noreferrer'}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          <span>{response.documentName}</span>
                        </a>
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

        {/* =============== JOBS TAB =============== */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {filteredJobs.map(job => {
              const currentUser = getCurrentUser();
              const isOwner = job.authorId === currentUser.id;
              
              return (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'open' ? 'bg-green-100 text-green-700' :
                          job.status === 'filled' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="font-medium text-slate-800">{job.company}</span>
                        <span>{job.location}</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                          {job.type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    {job.salary && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{job.salary}</p>
                        <p className="text-xs text-slate-500">per year</p>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-700 mb-4 line-clamp-3">{job.description}</p>

                  {job.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 4).map((req, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 4 && (
                          <span className="px-2 py-1 text-slate-500 text-sm">
                            +{job.requirements.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {job.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {job.views} views
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {job.applicants.length} applicants
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <>
                          {job.status === 'open' && (
                            <>
                              <button
                                onClick={() => handleUpdateJobStatus(job.id, 'filled')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Mark as Filled
                              </button>
                              <button
                                onClick={() => handleUpdateJobStatus(job.id, 'closed')}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Close
                              </button>
                            </>
                          )}
                          {job.status !== 'open' && (
                            <button
                              onClick={() => handleUpdateJobStatus(job.id, 'open')}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                            >
                              Reopen Position
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600 mb-4">Be the first to post a job opening!</p>
                <button
                  onClick={() => setShowCreateJob(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Post a Job
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============== CHAT TAB =============== */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
            <div className="flex h-full">
              {/* Chat Sidebar */}
              <div className="w-80 border-r border-slate-200 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Messages</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFriendsModal(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="Friends & requests"
                      >
                        <User className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowNewChat(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="New Chat"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowNewGroup(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="New Group"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {chats.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs mt-1">Start a new chat or create a group</p>
                    </div>
                  ) : (
                    chats.map(chat => {
                      const currentUser = getCurrentUser();
                      const otherParticipant = chat.type === 'private' 
                        ? chat.participants.find(p => p !== currentUser.id)
                        : null;
                      const otherUser = otherParticipant ? chatUsers.find(u => u.id === otherParticipant) : null;
                      const unread = chat.unreadCount[currentUser.id] || 0;

                      return (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat)}
                          className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                            selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                chat.type === 'group' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {chat.type === 'group' ? (
                                  <Users className="w-6 h-6" />
                                ) : (
                                  <User className="w-6 h-6" />
                                )}
                              </div>
                              {otherUser && (
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                  otherUser.status === 'online' ? 'bg-green-500' :
                                  otherUser.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
                                }`} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-slate-900 truncate">
                                  {chat.type === 'group' ? chat.name : (otherUser?.name || 'Unknown')}
                                </p>
                                {chat.lastMessage && (
                                  <span className="text-xs text-slate-500">
                                    {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-sm text-slate-500 truncate flex-1 min-w-0">
                                  {chat.lastMessage?.content || 'No messages yet'}
                                </p>
                                {mutedChatIds.includes(chat.id) && (
                                  <BellOff className="w-4 h-4 text-slate-400 flex-shrink-0" title="Muted" />
                                )}
                                {unread > 0 && (
                                  <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                                    {unread}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedChat.type === 'group' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {selectedChat.type === 'group' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {selectedChat.type === 'group' 
                              ? selectedChat.name 
                              : Object.values(selectedChat.participantNames).find(name => name !== getCurrentUserName())
                            }
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedChat.type === 'group' 
                              ? `${selectedChat.participants.length} members`
                              : 'Private Chat'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleStartVoiceCall}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                          title="Voice Call"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Video Call">
                          <Video className="w-5 h-5" />
                        </button>
                        <div className="relative" ref={chatMenuRef}>
                          <button
                            onClick={() => setShowChatMenuDropdown(prev => !prev)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Chat options"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {showChatMenuDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                              <button
                                onClick={() => selectedChat && handleMuteChat(selectedChat.id)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                {selectedChat && mutedChatIds.includes(selectedChat.id) ? (
                                  <>
                                    <Bell className="w-4 h-4" />
                                    Unmute chat
                                  </>
                                ) : (
                                  <>
                                    <BellOff className="w-4 h-4" />
                                    Mute chat
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => selectedChat && handleDeleteChat(selectedChat.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete chat
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {(chatMessages[selectedChat.id] || []).map(message => {
                        const currentUser = getCurrentUser();
                        const isOwn = message.senderId === currentUser.id;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                              {!isOwn && (
                                <p className="text-xs text-slate-500 mb-1 ml-1">{message.senderName}</p>
                              )}
                              <div className={`rounded-2xl px-4 py-2 ${
                                isOwn 
                                  ? 'bg-blue-600 text-white rounded-br-md' 
                                  : 'bg-slate-100 text-slate-900 rounded-bl-md'
                              }`}>
                                {message.type === 'document' && message.attachments.length > 0 && (
                                  <div className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
                                    isOwn ? 'bg-blue-700' : 'bg-slate-200'
                                  }`}>
                                    <File className="w-8 h-8" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{message.attachments[0].name}</p>
                                      <p className="text-xs opacity-75">{message.attachments[0].size}</p>
                                    </div>
                                    <button className={`p-1 rounded ${isOwn ? 'hover:bg-blue-600' : 'hover:bg-slate-300'}`}>
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                <p className="text-sm whitespace-pre-wrap">
                                  {message.content.split(/(@\w+)/g).map((part, idx) => {
                                    if (part.startsWith('@')) {
                                      return (
                                        <span key={idx} className={`font-medium ${isOwn ? 'text-blue-200' : 'text-blue-600'}`}>
                                          {part}
                                        </span>
                                      );
                                    }
                                    return part;
                                  })}
                                </p>
                              </div>
                              <p className={`text-xs text-slate-400 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-slate-200">
                      <div className="relative">
                        {/* Mention Dropdown */}
                        {showMentionDropdown && filteredMentionUsers.length > 0 && (
                          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 max-h-48 overflow-y-auto">
                            {filteredMentionUsers.map(user => (
                              <div
                                key={user.id}
                                onClick={() => handleSelectMention(user)}
                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                              >
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                  <p className={`text-xs ${
                                    user.status === 'online' ? 'text-green-600' :
                                    user.status === 'away' ? 'text-yellow-600' : 'text-slate-400'
                                  }`}>
                                    {user.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-end gap-3">
                          <label className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-600">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleSendDocument(file);
                              }}
                            />
                            <Paperclip className="w-5 h-5" />
                          </label>
                          <textarea
                            ref={chatInputRef}
                            value={chatMessage}
                            onChange={(e) => handleChatInputChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Type a message... (Use @ to mention)"
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={1}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!chatMessage.trim()}
                            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
                      <p className="text-slate-500 mb-4">Choose a chat from the sidebar or start a new one</p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setShowNewChat(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          New Chat
                        </button>
                        <button
                          onClick={() => setShowNewGroup(true)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Create Group
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =============== MODALS =============== */}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl text-slate-900">Create New Post</h3>
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  newPostMedia.forEach(({ previewUrl }) => {
                    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                  });
                  setNewPostMedia([]);
                  if (newPostMediaInputRef.current) newPostMediaInputRef.current.value = '';
                }}
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

              <div>
                <label className="block text-slate-700 mb-2">Pictures or videos</label>
                <input
                  ref={newPostMediaInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    const valid = files.filter((f: File) =>
                      f.type.startsWith('image/') || f.type.startsWith('video/')
                    );
                    setNewPostMedia(prev => [
                      ...prev,
                      ...valid.map((file: File) => ({
                        file,
                        previewUrl: URL.createObjectURL(file),
                      })),
                    ]);
                    e.target.value = '';
                  }}
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => newPostMediaInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 w-28 h-28 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors text-slate-500"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-xs">Add media</span>
                  </button>
                  {newPostMedia.map((item, index) => (
                    <div key={index} className="relative group w-28 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {item.file.type.startsWith('image/') ? (
                        <img
                          src={item.previewUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.previewUrl}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
                          setNewPostMedia(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 rounded text-white"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 truncate">
                        {item.file.type.startsWith('video/') ? 'Video' : 'Image'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Add images or videos. Files under 2MB are saved for later; larger files show until you refresh.
                </p>
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

      {/* Create Job Modal */}
      {showCreateJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl text-slate-900">Post a Job</h3>
              <button
                onClick={() => setShowCreateJob(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Safety Manager"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-2">Company *</label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-2">Job Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value as JobPost['type'] })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Salary Range</label>
                <input
                  type="text"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $60,000 - $80,000"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Job Description *</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Requirements (one per line)</label>
                <textarea
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="5+ years experience&#10;OSHA certification&#10;Strong communication skills"
                />
              </div>

              <button
                onClick={handleCreateJob}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Post Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-2xl text-slate-900">{selectedJob.title}</h3>
                <p className="text-slate-600">{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setJobApplicationResume(null);
                  setNewJobComment('');
                  if (jobApplicationResumeInputRef.current) jobApplicationResumeInputRef.current.value = '';
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedJob.status === 'open' ? 'bg-green-100 text-green-700' :
                  selectedJob.status === 'filled' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {selectedJob.status.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {selectedJob.type.replace('-', ' ')}
                </span>
                {selectedJob.salary && (
                  <span className="text-green-600 font-semibold">{selectedJob.salary}</span>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Description</h4>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Posted by {selectedJob.author}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {selectedJob.applicants.length} applicants
                </div>
              </div>

              {selectedJob.status === 'open' && selectedJob.authorId !== getCurrentUser().id && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Apply for this position</h4>
                  <textarea
                    placeholder="Tell us why you're a great fit for this role..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    rows={4}
                    id="job-application-message"
                  />
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Resume / Profile (optional)</label>
                    <input
                      ref={jobApplicationResumeInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setJobApplicationResume(file);
                        e.target.value = '';
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => jobApplicationResumeInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        <Upload className="w-4 h-4" />
                        {jobApplicationResume ? jobApplicationResume.name : 'Upload resume or profile'}
                      </button>
                      {jobApplicationResume && (
                        <button
                          type="button"
                          onClick={() => {
                            setJobApplicationResume(null);
                            if (jobApplicationResumeInputRef.current) jobApplicationResumeInputRef.current.value = '';
                          }}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">PDF, Word, or image. Max 2MB for saving across sessions.</p>
                  </div>
                  <button
                    onClick={() => {
                      const message = (document.getElementById('job-application-message') as HTMLTextAreaElement)?.value || '';
                      handleApplyForJob(selectedJob.id, message);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Submit Application
                  </button>
                </div>
              )}

              {/* Show applicants if owner */}
              {selectedJob.authorId === getCurrentUser().id && selectedJob.applicants.length > 0 && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    Applicants ({selectedJob.applicants.length})
                  </h4>
                  <div className="space-y-4">
                    {selectedJob.applicants.map(applicant => (
                      <div key={applicant.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{applicant.userName}</p>
                              <p className="text-sm text-slate-500">
                                Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            applicant.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {applicant.status}
                          </span>
                        </div>
                        {applicant.message && (
                          <p className="text-slate-700 text-sm mt-2">{applicant.message}</p>
                        )}
                        {(applicant.resumeUrl || applicant.resumeName) && (
                          applicant.resumeUrl && applicant.resumeUrl !== '#' ? (
                            <a
                              href={applicant.resumeUrl}
                              download={applicant.resumeName}
                              target={applicant.resumeUrl.startsWith('blob:') ? undefined : '_blank'}
                              rel={applicant.resumeUrl.startsWith('blob:') ? undefined : 'noopener noreferrer'}
                              className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:underline"
                            >
                              <FileText className="w-4 h-4" />
                              {applicant.resumeName || 'Resume / Profile'}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 mt-2 text-sm text-slate-500">
                              <FileText className="w-4 h-4" />
                              {applicant.resumeName || 'Resume attached'}
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h4 className="text-slate-900 font-medium mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({(selectedJob.comments ?? []).length})
                </h4>
                <div className="space-y-4 mb-4">
                  {(selectedJob.comments ?? []).length === 0 ? (
                    <p className="text-slate-500 text-sm">No comments yet. Be the first to ask a question or share feedback.</p>
                  ) : (
                    (selectedJob.comments ?? []).map(comment => (
                      <div key={comment.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900">{comment.author}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newJobComment}
                    onChange={(e) => setNewJobComment(e.target.value)}
                    placeholder="Add a comment or question..."
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddJobComment(selectedJob.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddJobComment(selectedJob.id)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
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

              {selectedPost.media && selectedPost.media.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h4 className="text-slate-900 font-medium flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Media ({selectedPost.media.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.media.map((m, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        {m.type === 'image' ? (
                          <img
                            src={m.url}
                            alt={m.name || 'Post image'}
                            className="w-full max-h-80 object-contain"
                          />
                        ) : (
                          <video
                            src={m.url}
                            controls
                            className="w-full max-h-80"
                            playsInline
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {m.name && (
                          <p className="text-xs text-slate-500 p-2 truncate">{m.name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

      {/* New Private Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl text-slate-900">Start New Chat</h3>
              <button
                onClick={() => setShowNewChat(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-slate-600 mb-2">Chat with friends</p>
              <p className="text-xs text-slate-500 mb-3">Or add new people as friends to chat with them</p>
              {(() => {
                const currentId = getCurrentUser().id;
                const friends = getFriends();
                const friendsList = chatUsers.filter(u => u.id !== currentId && friends.includes(u.id));
                const nonFriends = chatUsers.filter(u => u.id !== currentId && !friends.includes(u.id));
                const sentPending = (id: string) => friendRequests.some(r =>
                  r.fromUserId === currentId && r.toUserId === id && r.status === 'pending'
                );
                return (
                  <div className="space-y-4">
                    {friendsList.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Friends</h4>
                        <div className="space-y-2">
                          {friendsList.map(user => (
                            <div
                              key={user.id}
                              onClick={() => handleStartPrivateChat(user.id)}
                              className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-3"
                            >
                              <div className="relative">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5" />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                  user.status === 'online' ? 'bg-green-500' :
                                  user.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900">{user.name}</p>
                                <p className="text-sm text-slate-500">{user.status}</p>
                              </div>
                              <span className="text-sm text-blue-600">Chat</span>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {nonFriends.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Discover people</h4>
                        <div className="space-y-2">
                          {nonFriends.map(user => (
                            <div
                              key={user.id}
                              className="p-3 hover:bg-slate-50 rounded-lg flex items-center gap-3"
                            >
                              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900">{user.name}</p>
                                <p className="text-sm text-slate-500">{user.status}</p>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSendFriendRequest(user.id); }}
                                disabled={sentPending(user.id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm rounded-lg flex items-center gap-1"
                              >
                                <UserPlus className="w-4 h-4" />
                                {sentPending(user.id) ? 'Pending' : 'Add friend'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {friendsList.length === 0 && nonFriends.length === 0 && (
                      <p className="text-slate-500 text-sm">No other users yet. Add people as friends from the Friends panel (person icon).</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Friends & Requests Modal */}
      {showFriendsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl text-slate-900">Friends & requests</h3>
              <button
                onClick={() => setShowFriendsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {(() => {
                const currentId = getCurrentUser().id;
                const pendingReceived = friendRequests.filter(r =>
                  r.toUserId === currentId && r.status === 'pending'
                );
                const sent = friendRequests.filter(r =>
                  r.fromUserId === currentId && r.status === 'pending'
                );
                const friends = getFriends();
                const friendsUsers = chatUsers.filter(u => friends.includes(u.id));
                return (
                  <>
                    {pendingReceived.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Pending requests</h4>
                        <div className="space-y-2">
                          {pendingReceived.map(req => (
                            <div key={req.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{req.fromUserName}</p>
                                  <p className="text-xs text-slate-500">Wants to be your friend</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAcceptFriendRequest(req.id)}
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                  title="Accept"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeclineFriendRequest(req.id)}
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                  title="Decline"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {sent.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Sent requests</h4>
                        <div className="space-y-2">
                          {sent.map(req => (
                            <div key={req.id} className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{req.toUserName}</p>
                                <p className="text-xs text-slate-500">Pending</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Friends ({friendsUsers.length})</h4>
                      {friendsUsers.length === 0 ? (
                        <p className="text-slate-500 text-sm">No friends yet. Send friend requests from &quot;Start New Chat&quot; or add people you know.</p>
                      ) : (
                        <div className="space-y-2">
                          {friendsUsers.map(user => (
                            <div
                              key={user.id}
                              className="p-3 bg-slate-50 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                  </div>
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    user.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                                  }`} />
                                </div>
                                <p className="font-medium text-slate-900">{user.name}</p>
                              </div>
                              <button
                                onClick={() => {
                                  handleStartPrivateChat(user.id);
                                  setShowFriendsModal(false);
                                }}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                              >
                                Chat
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* New Group Chat Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl text-slate-900">Create Group</h3>
              <button
                onClick={() => setShowNewGroup(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Safety Team"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Add Members</label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  {chatUsers.filter(u => u.id !== getCurrentUser().id).map(user => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newGroup.selectedMembers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewGroup({
                              ...newGroup,
                              selectedMembers: [...newGroup.selectedMembers, user.id]
                            });
                          } else {
                            setNewGroup({
                              ...newGroup,
                              selectedMembers: newGroup.selectedMembers.filter(id => id !== user.id)
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-slate-900">{user.name}</span>
                    </label>
                  ))}
                </div>
                {newGroup.selectedMembers.length > 0 && (
                  <p className="text-sm text-slate-500 mt-2">
                    {newGroup.selectedMembers.length} member(s) selected
                  </p>
                )}
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!newGroup.name || newGroup.selectedMembers.length === 0}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" />
                Create Group
              </button>
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
