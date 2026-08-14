"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const timelineData = [
  {
    id: 1,
    title: "Kickoff Event",                      // 👈 node label
    content: "Keshav Sadhna, famed for his role as Karan in College Romance, captivates millions with his authentic acting, infectious energy, and versatility, emerging as a leading face of India’s digital entertainment and Gen-Z storytelling.", // 👈 card content
    status: "completed",                         // "completed" | "in-progress" | "pending"
    icon: Calendar,
    relatedIds: [2, 3],                          // 👈 connected nodes
  },
  {
    id: 2,
    title: "DIKSHANT",
    content: "Dikshant Jadhav is a rising music star known for his soulful voice and hit song 'Aankhon Se Batana' which has garnered millions of streams and widespread acclaim for its emotional depth.",
    status: "in-progress",
    icon: Mic,
    relatedIds: [1],
  },
  {
    id: 3,
    title: "HARINI SIVAKUMAR",
    content: "Harini Sivakumar, a former homemaker, founded Earth Rhythm after seeking safe, non-toxic skincare for her special-needs son. Starting small, she built a Rs 200 crore, plastic-negative clean beauty brand inspiring wellness and sustainability.",
    status: "pending",
    icon: Rocket,
    relatedIds: [1],
  },
];


export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = {};
      timelineData.forEach((item) => (newState[item.id] = false));
      newState[id] = !prev[id];
      setActiveNodeId(newState[id] ? id : null);
      setAutoRotate(!newState[id]);
      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.3) % 360);
      }, 50);
    }
    return () => clearInterval(rotationTimer);
  }, [autoRotate]);

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));

    return { x, y, zIndex };
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "text-white bg-[var(--tedx-red)] border-white";
      case "in-progress":
        return "text-black bg-white border-[var(--tedx-red)]";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
          setExpandedItems({});
          setActiveNodeId(null);
          setAutoRotate(true);
        }
      }}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div className="absolute w-full h-full flex items-center justify-center" ref={orbitRef}>
          {/* 🔴 Central Gradient Circle */}
          <div
            className="absolute w-24 h-24 rounded-full shadow-xl z-10"
            style={{
              background: "radial-gradient(circle, rgba(220,38,38,1) 0%, rgba(0,0,0,0.9) 100%)",
            }}
          />

          {/* Outer orbit ring */}
          <div className="absolute w-96 h-96 rounded-full border border-white/20"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
            };

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Node circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${isExpanded
                      ? "bg-[var(--tedx-red)] text-white"
                      : "bg-black text-white border border-white/40"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-125 shadow-lg shadow-red-500/40" : ""}
                    `}
                >
                  <Icon size={18} />
                </div>

                {/* Node label */}
                <div
                  className={`absolute top-14 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? "text-[var(--tedx-red)] scale-110" : "text-white/70"
                    }`}
                >
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-lg border border-white/30 shadow-xl shadow-red-500/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed"
                            ? "COMPLETE"
                            : item.status === "in-progress"
                              ? "IN PROGRESS"
                              : "PENDING"}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                      <p>{item.content}</p>

                      {/* Related Items */}
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                              Connected Nodes
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <span
                                  key={relatedId}
                                  className="px-2 py-1 text-xs border border-red-500/40 rounded bg-transparent text-white"
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 inline text-red-500" />
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
