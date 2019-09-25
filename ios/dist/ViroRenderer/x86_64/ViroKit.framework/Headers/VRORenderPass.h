//
//  VRORenderPass.h
//  ViroKit
//
//  Created by Raj Advani on 8/9/17.
//  Copyright © 2017 Viro Media. All rights reserved.
//

#ifndef VRORenderPass_h
#define VRORenderPass_h

#include <stdio.h>
#include <vector>
#include <memory>
#include <string>
#include <map>

class VROScene;
class VRODriver;
class VRODisplay;
class VROTexture;
class VRORenderContext;
class VRORenderTarget;

/*
 The inputs to a render pass are textures and (optionally) intermediate render
 targets. These are typically backed by depth, stencil, and/or color textures.
 The output of a render pass is a render target and (optionally) modified
 intermediate render targets.
 
 Textures and intermediate render targets are each keyed by names unique to the
 render pass.
 */
class VRORenderPassInputOutput {
public:
    std::map<std::string, std::shared_ptr<VROTexture>> textures;
    std::map<std::string, std::shared_ptr<VRORenderTarget>> targets;
    std::shared_ptr<VRORenderTarget> outputTarget;
};

/*
 Render passes represent a rendering of the scene to produce one or more render targets.
 Render passes take the full 3D scene as input, along with any previously created render
 targets. They can either render the 3D scene to a target, or implement post-processing by
 taking the input targets and creating new output targets.
 
 Render passes are chained together via the VROChoreographer.
 
 Render passes can also be configured to write directly to the display, in which case they
 may return no targets.
 */
class VRORenderPass {
public:
    
    VRORenderPass() {}
    virtual ~VRORenderPass() {}
    
    /*
     Perform the render pass. This is implemented by the subclasses. The outgoing scene is optional,
     and it used when we need to render the transition between two scenes.
     
     It is common and expected for render passes to re-use the same output render targets
     each frame.
     */
    virtual void render(std::shared_ptr<VROScene> scene,
                        std::shared_ptr<VROScene> outgoingScene,
                        VRORenderPassInputOutput &inputs,
                        VRORenderContext *context, std::shared_ptr<VRODriver> &driver) = 0;
    
};

#endif /* VRORenderPass_h */
