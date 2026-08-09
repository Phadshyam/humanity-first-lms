import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Calendar, User as UserIcon, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Toast from '../components/common/Toast';
import NewTopicModal from '../components/forum/NewTopicModal';
import ThreadDetailModal from '../components/forum/ThreadDetailModal';

const categories = ['All Posts', 'Field Notes', 'Policy Questions', 'Announcements'];

const CommunityNoticeboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const isPrivileged = user && (user.role === 'admin' || user.role === 'trainer');

  const fetchPosts = async (cat = activeCategory) => {
    try {
      setLoading(true);
      const queryCat = cat !== 'All Posts' ? `?category=${encodeURIComponent(cat)}` : '';
      const res = await api.get(`/forum${queryCat}`);
      if (res.data && res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('[CommunityNoticeboard] Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeCategory);
  }, [activeCategory]);

  const handlePostCreated = (newPost) => {
    setToastMessage('Discussion topic published successfully!');
    fetchPosts(activeCategory);
  };

  const handleOpenDetail = (thread) => {
    setSelectedThread(thread);
    setIsDetailOpen(true);
  };

  const handleReplyAdded = (updatedPost) => {
    setSelectedThread(updatedPost);
    setToastMessage('Reply submitted!');
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this discussion topic?')) return;

    try {
      const res = await api.delete(`/forum/${postId}`);
      if (res.data && res.data.success) {
        setToastMessage('Discussion topic deleted.');
        fetchPosts(activeCategory);
      }
    } catch (err) {
      console.error('[CommunityNoticeboard] Error deleting thread:', err);
      alert(err.response?.data?.message || 'Failed to delete discussion topic.');
    }
  };

  const getInitial = (name) => {
    if (!name) return 'H';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-8 bg-[#F5F1E8] min-h-screen text-[#24302B]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[#24302B]">
            Learn together.
          </h1>
          <p className="text-xs md:text-sm text-[#5C665F] mt-1 font-sans">
            Questions, field notes, and encouragement from the network.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsNewTopicOpen(true)}
          className="gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" /> New topic
        </Button>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#D4CEC0]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition ${
              activeCategory === cat
                ? 'bg-[#176B4D] text-[#FFFDF7] shadow-xs'
                : 'bg-[#FFFDF7] text-[#24302B] border border-[#D4CEC0] hover:bg-[#E9E4D8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Forum Feed */}
      {loading ? (
        /* CSS Skeleton Loaders */
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#FFFDF7] p-6 rounded-2xl border border-[#D4CEC0] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl skeleton-pulse shrink-0"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-4 rounded skeleton-pulse"></div>
                  <div className="w-20 h-3 rounded skeleton-pulse"></div>
                </div>
              </div>
              <div className="w-3/4 h-5 rounded skeleton-pulse"></div>
              <div className="w-full h-12 rounded skeleton-pulse"></div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => {
            const authorName = post.author ? post.author.name : 'Learner';
            const authorRole = post.author ? post.author.role : 'volunteer';
            const postDate = new Date(post.createdAt).toLocaleDateString('en-US');
            const repliesCount = post.replies ? post.replies.length : 0;

            return (
              <div
                key={post._id}
                onClick={() => handleOpenDetail(post)}
                className="bg-[#FFFDF7] p-6 rounded-2xl border border-[#D4CEC0] space-y-4 shadow-xs hover:border-[#176B4D] transition cursor-pointer"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar Box */}
                    <div className="w-10 h-10 rounded-xl bg-[#F0D4C3] text-[#C96B3C] font-extrabold text-sm flex items-center justify-center font-mono shrink-0 border border-[#C96B3C]/20">
                      {getInitial(authorName)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-heading text-[#24302B]">{authorName}</span>
                        <Badge role={authorRole} className="text-[9px] py-0 px-1.5">{authorRole}</Badge>
                        <span className="text-xs text-[#5C665F]">• {postDate}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#C96B3C] bg-[#E9E4D8] px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
                        {post.category || 'Field Notes'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#5C665F] bg-[#F5F1E8] px-3 py-1 rounded-full border border-[#D4CEC0] flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                      {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                    </span>

                    {/* Admin / Trainer Delete Control */}
                    {isPrivileged && (
                      <button
                        onClick={(e) => handleDeletePost(e, post._id)}
                        className="p-1.5 text-[#5C665F] hover:text-[#C96B3C] rounded-lg hover:bg-[#F0D4C3] transition"
                        title="Delete Thread"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-[#24302B] leading-snug hover:text-[#176B4D] transition">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#5C665F] line-clamp-2 leading-relaxed font-sans">
                    {post.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#FFFDF7] rounded-2xl border border-[#D4CEC0] space-y-3">
          <MessageSquare className="w-10 h-10 text-[#5C665F]/50 mx-auto" />
          <p className="text-sm font-semibold font-heading text-[#24302B]">No topics in this category yet.</p>
          <p className="text-xs text-[#5C665F]">Be the first to share field notes or ask questions!</p>
        </div>
      )}

      {/* New Topic Modal */}
      <NewTopicModal
        isOpen={isNewTopicOpen}
        onClose={() => setIsNewTopicOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Thread Detail & Reply Modal */}
      <ThreadDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        thread={selectedThread}
        onReplyAdded={handleReplyAdded}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default CommunityNoticeboard;
