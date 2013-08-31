package cn.edu.lzu.config;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

public class XmlParse {
	Document document;

	public XmlParse(String url) throws Exception {
		this.document = parse(url);
	}

	public Document parse(String url) throws DocumentException {
		SAXReader reader = new SAXReader();
		Document document = reader.read(url);
		return document;
	}

	public int getLength(Element ele) {
		List<Element> list = new ArrayList<Element>();
		list = ele.elements();
		return list.size();
	}

	
	public boolean isLeaf(Element ele) {
		if (ele.isTextOnly()) {
			return true;
		}
		return false;
	}

	
	public List<Element> iteratorEle(Element ele) {
		List<Element> list = new ArrayList<Element>();
		if (ele.isTextOnly()) {
			list.add(ele);
		} else {
			list = ele.elements();
		}
		return list;
	}
	
	public List<Element> recurseEle(List<Element> list,Element ele) {
//		List<Element> list = new ArrayList<Element>();
		if (ele.isTextOnly()) {
			list.add(ele);
		} else {
			list.add(ele);
			List<Element> list1 = ele.elements();
			for(Element e:list1)
			{
				recurseEle(list,e);
			}
		}
		return list;
	}
	public String getDomNodeTxt(Object obj) throws Exception {
		Node node = null;
		if (obj instanceof String) {
			node = (Node) document.selectSingleNode(obj.toString());
		} else if (obj instanceof Element) {
			node = (Node) obj;
		} else if (obj instanceof Node) {
			node = (Node) obj;
		} else {
			throw new Exception("unsuport" + obj.toString());
		}

		return node.getText().trim();

	}

	public java.util.Hashtable<String,String> getDomElementAttr(Object obj) throws Exception {
		Element element = null;
		if (obj instanceof String) {
			element = (Element) document.selectSingleNode(obj.toString());
		} else if (obj instanceof Element) {
			element = (Element) obj;
		} else if (obj instanceof Node) {
			element = (Element) obj;
		} else {
			throw new Exception("unsuport" + obj.toString());
		}

		java.util.Hashtable<String, String> ht = null;
		for (int i = 0; i < element.attributeCount(); i++) {
			if (ht == null)
				ht = new java.util.Hashtable<String, String>();
			ht.put(element.attribute(i).getName().trim().toLowerCase(), element
					.attribute(i).getValue().trim());

		}
		return ht;
	}

	public java.util.Hashtable<String,String> getDomElement(Object obj) throws Exception {
		Element element = null;
		if (obj instanceof String) {
			element = (Element) document.selectSingleNode(obj.toString());
		} else if (obj instanceof Element) {
			element = (Element) obj;
		} else if (obj instanceof Node) {
			element = (Element) obj;
		} else {
			throw new Exception("unsupport" + obj.toString());
		}

		java.util.Hashtable<String, String> ht = new java.util.Hashtable<String, String>();
		;
		for (int i = 0; i < element.attributeCount(); i++) {

			ht.put(element.attribute(i).getName().trim().toLowerCase(), element
					.attribute(i).getValue().trim());

		}

		ht.put("domtxt", element.getTextTrim());
		return ht;
	}

	public ArrayList<String[]> getAttributeList(String path) {
		ArrayList<String[]> xlsList = new ArrayList<String[]>();

		List list = document.selectNodes(path);
		// List list = document.selectNodes( "//files[1]/*" );1����һ��,���id=1
		Iterator iter = list.iterator();
		while (iter.hasNext()) {
			Element element = (Element) iter.next();
			int attCount = element.attributeCount();
			String[] attstr = new String[attCount];
			for (int i = 0; i < attCount; i++) {
				attstr[i] = element.attribute(i).getValue();
			}

			xlsList.add(attstr);

		}
		return xlsList;
	}

	public List<Element> getChildrenAttributeList(final String attric,
			final String value) throws Exception {
		// Element e = currentElement;
		//		
		// if (currentElement == null) {
		// e = document.getRootElement();
		// }
		// Iterator iter = e.elementIterator();
		// while (iter.hasNext()) {
		// Element element = (Element) iter.next();
		// java.util.Hashtable elementHt = getDomElementAttr(element);
		// String v = (String) elementHt.get(attric);
		// if(v.equals(value))
		// {
		//				
		// }
		// else
		// {
		//				
		// }
		// }
		// document.s

		Element e = (Element) document.selectSingleNode("//*[@" + attric
				+ "=\"" + value + "\"]");

		java.util.List<Element> list = iteratorEle(e);

		return list;

	}
	
	public List<Element> getAllChildrenAttributeList(final String attric,
			final String value) throws Exception {
		

		Element e = (Element) document.selectSingleNode("//*[@" + attric
				+ "=\"" + value + "\"]");
		java.util.List<Element> list =new java.util.ArrayList<Element>();
		recurseEle(list,e);

		return list;

	}

}
