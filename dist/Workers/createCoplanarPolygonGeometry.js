define(["./arrayRemoveDuplicates-707c233c","./BoundingRectangle-8fed902e","./Transforms-1142ce48","./Cartesian2-08065eec","./Check-be2d5acb","./ComponentDatatype-a867ddaa","./CoplanarPolygonGeometryLibrary-cd5a1869","./when-ad3237a0","./GeometryAttribute-da891979","./GeometryAttributes-27dc652d","./GeometryInstance-42129c83","./GeometryPipeline-3334f964","./IndexDatatype-9504f550","./Math-5ca9b250","./PolygonGeometryLibrary-967e68c5","./PolygonPipeline-ac773b7c","./VertexFormat-fc4fc84a","./combine-1510933d","./RuntimeError-767bd866","./WebGLConstants-1c8239cc","./OrientedBoundingBox-2cc6ca57","./EllipsoidTangentPlane-f8b1fc8b","./AxisAlignedBoundingBox-718a9087","./IntersectionTests-75083888","./Plane-bb88dd7e","./AttributeCompression-9fbb8447","./EncodedCartesian3-a785c24c","./ArcType-98ec98bf","./EllipsoidRhumbLine-4a6ed5de"],function(h,e,L,E,t,T,C,l,D,_,v,x,k,V,f,R,s,n,a,r,o,i,c,p,y,m,u,d,g){"use strict";var I=new E.Cartesian3,P=new e.BoundingRectangle,M=new E.Cartesian2,B=new E.Cartesian2,A=new E.Cartesian3,w=new E.Cartesian3,F=new E.Cartesian3,G=new E.Cartesian3,H=new E.Cartesian3,O=new E.Cartesian3,z=new L.Quaternion,S=new L.Matrix3,N=new L.Matrix3,Q=new E.Cartesian3;function b(e){var t=(e=l.defaultValue(e,l.defaultValue.EMPTY_OBJECT)).polygonHierarchy,n=l.defaultValue(e.vertexFormat,s.VertexFormat.DEFAULT);this._vertexFormat=s.VertexFormat.clone(n),this._polygonHierarchy=t,this._stRotation=l.defaultValue(e.stRotation,0),this._ellipsoid=E.Ellipsoid.clone(l.defaultValue(e.ellipsoid,E.Ellipsoid.WGS84)),this._workerName="createCoplanarPolygonGeometry",this.packedLength=f.PolygonGeometryLibrary.computeHierarchyPackedLength(t)+s.VertexFormat.packedLength+E.Ellipsoid.packedLength+2}b.fromPositions=function(e){return new b({polygonHierarchy:{positions:(e=l.defaultValue(e,l.defaultValue.EMPTY_OBJECT)).positions},vertexFormat:e.vertexFormat,stRotation:e.stRotation,ellipsoid:e.ellipsoid})},b.pack=function(e,t,n){return n=l.defaultValue(n,0),n=f.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,n),E.Ellipsoid.pack(e._ellipsoid,t,n),n+=E.Ellipsoid.packedLength,s.VertexFormat.pack(e._vertexFormat,t,n),n+=s.VertexFormat.packedLength,t[n++]=e._stRotation,t[n]=e.packedLength,t};var j=E.Ellipsoid.clone(E.Ellipsoid.UNIT_SPHERE),U=new s.VertexFormat,Y={polygonHierarchy:{}};return b.unpack=function(e,t,n){t=l.defaultValue(t,0);var a=f.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=a.startingIndex,delete a.startingIndex;var r=E.Ellipsoid.unpack(e,t,j);t+=E.Ellipsoid.packedLength;var o=s.VertexFormat.unpack(e,t,U);t+=s.VertexFormat.packedLength;var i=e[t++],t=e[t];return(n=!l.defined(n)?new b(Y):n)._polygonHierarchy=a,n._ellipsoid=E.Ellipsoid.clone(r,n._ellipsoid),n._vertexFormat=s.VertexFormat.clone(o,n._vertexFormat),n._stRotation=i,n.packedLength=t,n},b.createGeometry=function(e){var t=e._vertexFormat,n=e._polygonHierarchy,a=e._stRotation,r=n.positions;if(!((r=h.arrayRemoveDuplicates(r,E.Cartesian3.equalsEpsilon,!0)).length<3)){var o=A,i=w,l=F,s=H,c=O;if(C.CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments(r,G,s,c)){o=E.Cartesian3.cross(s,c,o);o=E.Cartesian3.normalize(o,o),E.Cartesian3.equalsEpsilon(G,E.Cartesian3.ZERO,V.CesiumMath.EPSILON6)||(p=e._ellipsoid.geodeticSurfaceNormal(G,Q),E.Cartesian3.dot(o,p)<0&&(o=E.Cartesian3.negate(o,o),s=E.Cartesian3.negate(s,s)));var p=C.CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction(G,s,c),y=C.CoplanarPolygonGeometryLibrary.createProjectPointTo2DFunction(G,s,c);t.tangent&&(i=E.Cartesian3.clone(s,i)),t.bitangent&&(l=E.Cartesian3.clone(c,l));var n=f.PolygonGeometryLibrary.polygonsFromHierarchy(n,p,!1),p=n.hierarchy,m=n.polygons;if(0!==p.length){for(var r=p[0].outerRing,n=L.BoundingSphere.fromPoints(r),u=f.PolygonGeometryLibrary.computeBoundingRectangle(o,y,r,a,P),d=[],g=0;g<m.length;g++){var b=new v.GeometryInstance({geometry:function(e,t,n,a,r,o,i,l){var s=e.positions,c=R.PolygonPipeline.triangulate(e.positions2D,e.holes);c.length<3&&(c=[0,1,2]),(e=k.IndexDatatype.createTypedArray(s.length,c.length)).set(c);var p=S;0!==a?(c=L.Quaternion.fromAxisAngle(o,a,z),p=L.Matrix3.fromQuaternion(c,p),(t.tangent||t.bitangent)&&(c=L.Quaternion.fromAxisAngle(o,-a,z),u=L.Matrix3.fromQuaternion(c,N),i=E.Cartesian3.normalize(L.Matrix3.multiplyByVector(u,i,i),i),t.bitangent&&(l=E.Cartesian3.normalize(E.Cartesian3.cross(o,i,l),l)))):p=L.Matrix3.clone(L.Matrix3.IDENTITY,p);var y=B;t.st&&(y.x=n.x,y.y=n.y);for(var m=s.length,u=3*m,d=new Float64Array(u),g=t.normal?new Float32Array(u):void 0,b=t.tangent?new Float32Array(u):void 0,h=t.bitangent?new Float32Array(u):void 0,C=t.st?new Float32Array(2*m):void 0,v=0,x=0,f=0,P=0,A=0,w=0;w<m;w++){var F,G=s[w];d[v++]=G.x,d[v++]=G.y,d[v++]=G.z,t.st&&(F=r(L.Matrix3.multiplyByVector(p,G,I),M),E.Cartesian2.subtract(F,y,F),G=V.CesiumMath.clamp(F.x/n.width,0,1),F=V.CesiumMath.clamp(F.y/n.height,0,1),C[A++]=G,C[A++]=F),t.normal&&(g[x++]=o.x,g[x++]=o.y,g[x++]=o.z),t.tangent&&(b[P++]=i.x,b[P++]=i.y,b[P++]=i.z),t.bitangent&&(h[f++]=l.x,h[f++]=l.y,h[f++]=l.z)}return u=new _.GeometryAttributes,t.position&&(u.position=new D.GeometryAttribute({componentDatatype:T.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:d})),t.normal&&(u.normal=new D.GeometryAttribute({componentDatatype:T.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:g})),t.tangent&&(u.tangent=new D.GeometryAttribute({componentDatatype:T.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:b})),t.bitangent&&(u.bitangent=new D.GeometryAttribute({componentDatatype:T.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:h})),t.st&&(u.st=new D.GeometryAttribute({componentDatatype:T.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:C})),new D.Geometry({attributes:u,indices:e,primitiveType:D.PrimitiveType.TRIANGLES})}(m[g],t,u,a,y,o,i,l)});d.push(b)}p=x.GeometryPipeline.combineInstances(d)[0];p.attributes.position.values=new Float64Array(p.attributes.position.values),p.indices=k.IndexDatatype.createTypedArray(p.attributes.position.values.length/3,p.indices);r=p.attributes;return t.position||delete r.position,new D.Geometry({attributes:r,indices:p.indices,primitiveType:p.primitiveType,boundingSphere:n})}}}},function(e,t){return l.defined(t)&&(e=b.unpack(e,t)),b.createGeometry(e)}});
