import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Video
} from 'lucide-react'
import { reviewService } from '../../services/reviewService'

export const ReviewShorts = ({ limit = 5, showViewAll = true, title, subtitle }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeVideoId, setActiveVideoId] = useState(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const { data } = await reviewService.getPublishedReviews()
      if (data) {
        setReviews(limit ? data.slice(0, limit) : data)
      }
    } catch (err) {
      console.warn('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayVideo = (id) => {
    setActiveVideoId(id)
  }

  const handleStopVideo = () => {
    setActiveVideoId(null)
  }

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <section className="py-14 sm:py-18 bg-[#F7F4FC] border-t border-[#E9EBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="h-8 w-80 bg-slate-300 rounded"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="aspect-[9/16] bg-slate-200 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <section className="py-14 sm:py-20 bg-[#F7F4FC] border-b border-[#E9EBF0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD0F3] text-xs font-black text-[#321078]">
              <Video className="w-3.5 h-3.5 text-[#FFC900]" />
              <span>Real Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#26075D] tracking-tight">
              {title || 'Candidate Success Stories'}
            </h2>
            <p className="text-xs sm:text-sm text-[#58617F] max-w-2xl leading-relaxed">
              {subtitle || 'Watch authentic short video testimonials from technicians, operators, and professionals deployed to UAE and Saudi Arabia.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-xl bg-white border border-[#DDD0F3] hover:bg-[#321078] hover:text-white text-[#26075D] flex items-center justify-center transition-all shadow-xs"
                aria-label="Previous video testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-xl bg-white border border-[#DDD0F3] hover:bg-[#321078] hover:text-white text-[#26075D] flex items-center justify-center transition-all shadow-xs"
                aria-label="Next video testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {showViewAll && (
              <Link
                to="/reviews"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-extrabold text-xs sm:text-sm transition-colors shadow-sm uppercase tracking-wide"
              >
                <span>View All Reviews</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            )}
          </div>
        </div>

        {/* Video Shorts Carousel / Responsive Grid */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => {
            const isPlaying = activeVideoId === review.id
            return (
              <div
                key={review.id}
                className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
              >
                <ReviewVideoCard
                  review={review}
                  isPlaying={isPlaying}
                  onPlay={() => handlePlayVideo(review.id)}
                  onStop={handleStopVideo}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * Individual 9:16 Video Short Card (Purple & Yellow Themed)
 */
export const ReviewVideoCard = ({ review, isPlaying, onPlay, onStop }) => {
  const videoRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch((e) => {
        console.warn('Autoplay prevented:', e)
      })
    }
  }, [isPlaying])

  const togglePlayPause = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPaused(false)
    } else {
      videoRef.current.pause()
      setIsPaused(true)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    e.stopPropagation()
    const seekTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const handleClose = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.pause()
    }
    onStop()
  }

  return (
    <div className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-[#26075D] shadow-lg border-2 border-white hover:border-[#FFC900] hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
      {isPlaying ? (
        /* Video Playing State */
        <div className="relative w-full h-full bg-black flex flex-col justify-between">
          <video
            ref={videoRef}
            src={review.video_url}
            className="w-full h-full object-cover"
            playsInline
            controls={false}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPaused(true)}
            onClick={togglePlayPause}
          />

          {/* Top Control Bar with Close and Country info */}
          <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 bg-[#26075D]/90 backdrop-blur-xs text-[#FFC900] text-[11px] font-black px-3 py-1 rounded-full border border-[#FFC900]/30">
              <span>{review.country === 'UAE' ? '🇦🇪 UAE' : '🇸🇦 Saudi Arabia'}</span>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 backdrop-blur-xs transition-colors"
              aria-label="Close video player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Center Play Indicator when Paused */}
          {isPaused && (
            <div 
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFC900] text-[#26075D] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1 fill-[#26075D]" />
              </div>
            </div>
          )}

          {/* Bottom Player Overlay & Controls */}
          <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 space-y-2">
            {/* Scrubber / Progress Bar */}
            <div className="w-full flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#FFC900]"
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayPause}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                  aria-label={isPaused ? 'Play' : 'Pause'}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-[#FFC900]" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-[10px] text-slate-300 font-mono">
                  {formatSeconds(currentTime)} / {formatSeconds(duration)}
                </span>
              </div>

              {review.candidate_name && (
                <span className="text-[11px] font-bold text-white truncate max-w-[110px]">
                  {review.candidate_name}
                </span>
              )}
            </div>

            {review.testimonial_title && (
              <p className="text-[11px] text-slate-200 line-clamp-1 font-medium">
                {review.testimonial_title}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Poster / Card State with Bright Yellow Play Button */
        <div 
          onClick={onPlay} 
          className="relative w-full h-full cursor-pointer flex flex-col justify-between"
        >
          {/* Background Thumbnail Image */}
          {review.thumbnail_url ? (
            <img
              src={review.thumbnail_url}
              alt={review.testimonial_title || review.candidate_name || 'Candidate Review Video'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#26075D] flex items-center justify-center text-slate-400">
              <Video className="w-12 h-12 text-[#FFC900]" />
            </div>
          )}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#26075D]/95 via-transparent to-[#26075D]/60 pointer-events-none" />

          {/* Top Badges */}
          <div className="relative z-10 p-3.5 flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 bg-[#26075D]/90 backdrop-blur-xs text-[#FFC900] text-[11px] font-black px-3 py-1 rounded-full border border-[#FFC900]/30 shadow-xs">
              <span>{review.country === 'UAE' ? '🇦🇪 UAE' : '🇸🇦 Saudi Arabia'}</span>
            </span>

            {review.job_category && (
              <span className="bg-[#321078]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 shadow-xs truncate max-w-[120px]">
                {review.job_category}
              </span>
            )}
          </div>

          {/* Center Bright Yellow Play Button */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-16 h-16 rounded-full bg-[#FFC900]/30 animate-ping opacity-75 group-hover:opacity-100" />
              <div className="w-14 h-14 rounded-full bg-[#FFC900] group-hover:bg-[#F5B900] text-[#26075D] flex items-center justify-center shadow-xl transition-all duration-200 transform group-hover:scale-110 border-2 border-white">
                <Play className="w-6 h-6 ml-1 fill-[#26075D]" />
              </div>
            </div>
            <span className="mt-2 text-[10px] font-black uppercase tracking-wider text-white bg-[#26075D]/80 backdrop-blur-xs px-3 py-0.5 rounded-full border border-white/20">
              Watch Story
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 p-4 space-y-1 text-white">
            {review.candidate_name && (
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {review.candidate_name}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#FFC900] shrink-0" />
              </div>
            )}

            {review.testimonial_title && (
              <p className="text-xs text-slate-200 line-clamp-2 leading-snug font-normal">
                "{review.testimonial_title}"
              </p>
            )}

            <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-300 border-t border-white/15">
              <span>Verified Deployment</span>
              <span className="text-[#FFC900] font-bold">Play Video →</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const formatSeconds = (sec) => {
  if (isNaN(sec) || sec === Infinity) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}
