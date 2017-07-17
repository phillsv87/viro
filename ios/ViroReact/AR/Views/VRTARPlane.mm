//
//  VRTARPlane.mm
//  ViroReact
//
//  Created by Andy Chu on 6/15/17.
//  Copyright © 2017 Viro Media. All rights reserved.
//

#import "VRTARPlane.h"

static float const kARPlaneDefaultMinHeight = 0;
static float const kARPlaneDefaultMinWidth = 0;

@implementation VRTARPlane {
    bool _dimensionsUpdated;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    self = [super initWithBridge:bridge];
    if (self) {
        _minWidth = kARPlaneDefaultMinWidth;
        _minHeight = kARPlaneDefaultMinHeight;
        _arNodeDelegate = std::make_shared<VROARNodeDelegateiOS>(self);
        
        std::shared_ptr<VROARPlane> plane = std::dynamic_pointer_cast<VROARPlane>([self node]);
        plane->setARNodeDelegate(_arNodeDelegate);
    }
    return self;
}

- (void)viewWillDisappear {
    if ([self scene]) {
        std::shared_ptr<VROARScene> arScene = std::dynamic_pointer_cast<VROARScene>([self scene]);
        arScene->removeARPlane(std::dynamic_pointer_cast<VROARPlane>(self.node));
    }
    [super viewWillDisappear];
}

- (void)setScene:(std::shared_ptr<VROScene>)scene {
    std::shared_ptr<VROARScene> arScene = std::dynamic_pointer_cast<VROARScene>(scene);
    arScene->addARPlane(std::dynamic_pointer_cast<VROARPlane>(self.node));
    [super setScene:scene];
}

- (void)setMinHeight:(float)minHeight {
    _minHeight = minHeight;
    _dimensionsUpdated = true;
    std::shared_ptr<VROARPlane> plane = std::dynamic_pointer_cast<VROARPlane>([self node]);
    if (plane) {
        plane->setMinHeight(_minHeight);
    }
}

- (void)setMinWidth:(float)minWidth {
    _minWidth = minWidth;
    _dimensionsUpdated = true;
    std::shared_ptr<VROARPlane> plane = std::dynamic_pointer_cast<VROARPlane>([self node]);
    if (plane) {
        plane->setMinWidth(_minWidth);
    }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
    if (_dimensionsUpdated) {
        std::shared_ptr<VROARScene> arScene = std::dynamic_pointer_cast<VROARScene>(self.scene);
        if (arScene) {
            arScene->updateARPlane(std::dynamic_pointer_cast<VROARPlane>(self.node));
            _dimensionsUpdated = false;
        }
    }
}

- (std::shared_ptr<VRONode>)createVroNode {
    return std::make_shared<VROARPlane>(kARPlaneDefaultMinWidth, kARPlaneDefaultMinHeight);
}

- (NSDictionary *)createDictionaryFromAnchor:(std::shared_ptr<VROARAnchor>) anchor {
    std::shared_ptr<VROARPlaneAnchor> planeAnchor = std::dynamic_pointer_cast<VROARPlaneAnchor>(anchor);
    VROVector3f center = planeAnchor->getCenter();
    VROMatrix4f transform = planeAnchor->getTransform();
    VROQuaternion rotation = transform.extractRotation(transform.extractScale());
    VROVector3f extent = planeAnchor->getExtent();
    return @{
             @"position" : @[@(center.x), @(center.y), @(center.z)],
             @"rotation" : @[@(rotation.X), @(rotation.Y), @(rotation.Z)],
             @"width" : @(extent.x),
             @"height" : @(extent.z)
             };
}

@end
