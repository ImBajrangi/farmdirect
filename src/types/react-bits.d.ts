import React from 'react';

declare module '@/components/ui/CurvedLoop' {
  export interface CurvedLoopProps {
    marqueeText?: string;
    speed?: number;
    className?: string;
    curveAmount?: number;
    direction?: 'left' | 'right';
    interactive?: boolean;
    pauseOnHover?: boolean;
    color?: string;
    edgeFade?: number;
    shape?: 'arc' | 'wave' | 'ring';
    fontSize?: number;
    fontWeight?: number | string;
    letterSpacing?: number;
    outline?: boolean;
    separator?: string;
    separatorColor?: string;
    scrollBoost?: number;
  }
  const CurvedLoop: React.FC<CurvedLoopProps>;
  export default CurvedLoop;
}

declare module '@/components/ui/ScrollFloat' {
  export interface ScrollFloatProps {
    children: React.ReactNode;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    containerClassName?: string;
    textClassName?: string;
    effect?: 'float' | 'skew' | 'fade' | 'blur';
    splitBy?: 'chars' | 'words';
    direction?: 'up' | 'down';
    order?: 'start' | 'end' | 'center' | 'random';
    fromColor?: string;
    animationDuration?: number;
    ease?: string;
    scrollStart?: string;
    scrollEnd?: string;
    stagger?: number;
    distance?: number;
    stretch?: number;
    smoothing?: number;
  }
  const ScrollFloat: React.FC<ScrollFloatProps>;
  export default ScrollFloat;
}

declare module '@/components/ui/LaserFlow' {
  export interface LaserFlowProps {
    surfaceRef?: React.RefObject<HTMLElement | null>;
    beamPosition?: number;
    surfaceLevel?: number;
    color?: string;
    intensity?: number;
    beamWidth?: number;
    flare?: number;
    spread?: number;
    spill?: number;
    fog?: number;
    dust?: number;
    streaks?: number;
    dots?: number;
    pulse?: number;
    speed?: number;
    seed?: number;
    mouseInteraction?: boolean;
    revealImage?: string;
    revealRadius?: number;
    revealOpacity?: number;
    intro?: boolean;
    theme?: 'dark' | 'light';
    paused?: boolean;
    dpr?: number;
    className?: string;
    style?: React.CSSProperties;
  }
  export const LaserFlow: React.FC<LaserFlowProps>;
  export default LaserFlow;
}

declare module '@/components/ui/TechText' {
  export interface TechTextProps {
    text?: string;
    fontFamily?: string;
    fontWeight?: number | string;
    fontSize?: number;
    letterSpacing?: number;
    color?: string;
    accentColor?: string;
    align?: 'center' | 'left' | 'right';
    reach?: number;
    softness?: number;
    dashLength?: number;
    dashGap?: number;
    strokeWidth?: number;
    lineStyle?: 'dashed' | 'solid';
    reveal?: 'letter' | 'word' | 'all';
    specks?: number;
    selection?: boolean;
    labels?: boolean;
    draggable?: boolean;
    bounce?: number;
    sweep?: boolean;
    speed?: number;
    clickKick?: boolean;
    intro?: 'none' | 'sweep' | 'fade';
    introDuration?: number;
    guides?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
  const TechText: React.FC<TechTextProps>;
  export default TechText;
}

declare module '@/components/ui/SlingButton' {
  export interface SlingButtonProps {
    children?: React.ReactNode;
    onSend?: () => void;
    padColor?: string;
    iconColor?: string;
    accentColor?: string;
    wellColor?: string;
    bandColor?: string;
    size?: number;
    strokeWidth?: number;
    armAt?: number;
    maxPull?: number;
    launchSpeed?: number;
    recoil?: number;
    flight?: number;
    particles?: number;
    spread?: number;
    className?: string;
    ariaLabel?: string;
  }
  const SlingButton: React.FC<SlingButtonProps>;
  export default SlingButton;
}

declare module '@/components/react-bits/SlingButton' {
  export interface SlingButtonProps {
    children?: React.ReactNode;
    onSend?: () => void;
    padColor?: string;
    iconColor?: string;
    accentColor?: string;
    wellColor?: string;
    bandColor?: string;
    size?: number;
    strokeWidth?: number;
    armAt?: number;
    maxPull?: number;
    launchSpeed?: number;
    recoil?: number;
    flight?: number;
    particles?: number;
    spread?: number;
    className?: string;
    ariaLabel?: string;
  }
  const SlingButton: React.FC<SlingButtonProps>;
  export default SlingButton;
}

